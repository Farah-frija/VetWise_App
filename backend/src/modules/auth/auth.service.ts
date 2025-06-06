// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { toDataURL } from 'qrcode';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { PasswordReset } from './entities/password-reset.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  private config: any;
  constructor(
    private usersService: UtilisateurService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {
    this.config = this.configService.get('jwt');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Compte désactivé');
    }
    if (!user.estVerifie) {
      throw new ForbiddenException('Compte non vérifié');
    }
    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const { motDePasse, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.motDePasse);

    if (user.twoFactorEnabled && !loginDto.twoFactorSecret) {
      throw new UnauthorizedException(
        "L'authentification à deux facteurs est requise pour cet utilisateur",
      );
    }

    if (user.twoFactorEnabled && loginDto.twoFactorSecret) {
      const isCodeValid = this.verifyTwoFactorCode(
        user.id,
        loginDto.twoFactorSecret,
      );
      if (!isCodeValid) {
        throw new UnauthorizedException(
          "Code d'authentification à deux facteurs invalide",
        );
      }
    }

    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.createUser(registerDto);
  }

  private generateTokens(user: Partial<Utilisateur>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.config.signOptions.expiresIn,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.config.refreshToken.expiresIn,
      }),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        estVerifie: user.estVerifie,
      },
      Message: 'Vous êtes connecté avec succès',
      success: true,
    };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Jeton de rafraîchissement invalide');
    }
  }

  async setupTwoFactor(userId: number) {
    const secret = speakeasy.generateSecret({
      name: 'VetMed Application',
    });

    await this.usersService.setTwoFactorSecret(userId, secret.base32);

    const qrCodeDataUrl = await toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      qrCodeDataUrl,
    };
  }

  async verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user['twoFactorSecret']) {
      return false;
    }
    return speakeasy.totp.verify({
      secret: user['twoFactorSecret'],
      encoding: 'base32',
      token: code,
    });
  }

  async enableTwoFactor(userId: number): Promise<void> {
    await this.usersService.updateTwoFactorEnabled(userId, true);
  }

  async disableTwoFactor(userId: number): Promise<void> {
    await this.usersService.updateTwoFactorEnabled(userId, false);
  }
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.motDePasse,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    user.motDePasse = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, user);
  }
  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.passwordResetRepository.save({
      user: user,
      token: token,
      createdAt: new Date(),
      expiresAt: expiresAt,
    });
    await this.mailService.sendPasswordResetEmail(
      user.email,
      user.prenom,
      token,
    );
  }
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      throw new BadRequestException(
        'Token de réinitialisation invalide ou expiré',
      );
    }
    if (!passwordReset.user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    const user = passwordReset.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.motDePasse = hashedPassword;

    await this.usersService.update(user.id, user);

    await this.passwordResetRepository.remove(passwordReset);
  }
}
