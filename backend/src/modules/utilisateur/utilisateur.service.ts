import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';
import { GenericService } from '../../common/services/generic.service';
import { RegisterDto } from '../auth/dto/register.dto';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { UserRole } from '../../common/enums/roles.enum';
import { ProprietaireAnimal } from './entities/proprietaire-animal.entity';
import { Veterinaire } from './entities/veterinaire.entity';
@Injectable()
export class UtilisateurService extends GenericService<Utilisateur> {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly UtilisateurRepository: Repository<Utilisateur>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {
    super(UtilisateurRepository);
  }
  async findByEmail(email: string): Promise<Utilisateur | null> {
    const user = await this.UtilisateurRepository.findOne({
      where: { email, deletedAt: null },
    });

    return user;
  }
  async createUser(
    createUserDto: RegisterDto,
  ): Promise<Omit<Utilisateur, 'motDePasse' | 'twoFactorSecret'>> {
    return this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(Utilisateur, {
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered !');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.motDePasse,
        saltRounds,
      );

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date();
      verificationExpires.setHours(verificationExpires.getHours() + 24);

      let newUser: Utilisateur;

      if (createUserDto.role === UserRole.PET_OWNER) {
        newUser = new ProprietaireAnimal();
      } else if (createUserDto.role === UserRole.VETERINARIAN) {
        newUser = new Veterinaire();
        (newUser as Veterinaire).numLicence = createUserDto.numLicence;
        (newUser as Veterinaire).specialites = createUserDto.specialization;
      } else {
        throw new BadRequestException('Invalid role provided!');
      }

      newUser.email = createUserDto.email;
      newUser.prenom = createUserDto.prenom;
      newUser.nom = createUserDto.nom;
      newUser.motDePasse = hashedPassword;
      newUser.telephone = createUserDto.telephone;
      newUser.adresse = createUserDto.adresse;
      newUser.verificationToken = verificationToken;
      newUser.verificationExpires = verificationExpires;

      await manager.save(newUser);

      const verifEmailResult = await this.mailService.sendVerificationEmail(
        newUser.email,
        newUser.prenom,
        verificationToken,
      );

      console.log('Email sent:', verifEmailResult);
      if (!verifEmailResult.success) {
        throw new BadRequestException('Failed to send verification email');
      }

      const { motDePasse, twoFactorSecret, ...result } = newUser;
      return result;
    });
  }
  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.UtilisateurRepository.findOne({
      where: { verificationToken: token, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    if (user.estVerifie) {
      return { success: true, message: 'Email already verified' };
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    user.estVerifie = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await this.UtilisateurRepository.save(user);

    return { success: true, message: 'Email successfully verified' };
  }
  async setTwoFactorSecret(userId: number, code: string): Promise<void> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.UtilisateurRepository.update(userId, { twoFactorSecret: code });
  }

  async updateTwoFactorEnabled(
    userId: number,
    isEnabled: boolean,
  ): Promise<void> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.UtilisateurRepository.update(userId, {
      twoFactorEnabled: isEnabled,
    });
  }

  async updateLastLogin(userId: number): Promise<void> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.UtilisateurRepository.update(userId, { lastLogin: new Date() });
  }
}
