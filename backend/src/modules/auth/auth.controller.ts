import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { Public } from './decorators/public.decorator';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { UserRole } from 'src/common/enums/roles.enum';
import { Roles } from './decorators/roles.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth') // Group name in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UtilisateurService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
  @UseGuards(JwtAuthGuard)
  //@UseGuards(RolesGuard)
  //@Roles(UserRole.PET_OWNER)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/setup')
  async setupTwoFactor(@Request() req) {
    return this.authService.setupTwoFactor(req.user.utilisateur_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/enable')
  @HttpCode(HttpStatus.OK)
  async enableTwoFactor(@Request() req, @Body() twoFactorDto: TwoFactorDto) {
    const isValid = await this.authService.verifyTwoFactorCode(
      req.user.utilisateur_id,
      twoFactorDto.code,
    );

    if (!isValid) {
      return { success: false, message: 'Code invalide' };
    }

    await this.authService.enableTwoFactor(req.user.utilisateur_id);
    return {
      success: true,
      message: 'Authentification à deux facteurs activée',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/disable')
  @HttpCode(HttpStatus.OK)
  async disableTwoFactor(@Request() req) {
    await this.authService.disableTwoFactor(req.user.utilisateur_id);
    return {
      success: true,
      message: 'Authentification à deux facteurs désactivée',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true, message: 'Déconnexion réussie' };
  }
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    let result: { success: boolean; message: string };
    if (!token) {
      return {
        success: false,
        message: 'Token de vérification manquant',
      };
    }
    return (result = await this.userService.verifyEmail(token));
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      req.user.utilisateur_id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Mot de passe changé avec succès' };
  }
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.sendPasswordResetEmail(forgotPasswordDto.email);
    return {
      message:
        'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé',
    };
  }
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
