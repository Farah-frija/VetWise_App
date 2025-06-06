import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../../common/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  prenom: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty()
  motDePasse: string;

  @IsString()
  @ApiProperty()
  role: UserRole;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  adresse?: string;

  @IsOptional()
  @ValidateIf((o) => o.role === UserRole.PET_OWNER)
  petTypePreference?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.role === UserRole.VETERINARIAN)
  specialization?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.role === UserRole.VETERINARIAN)
  numLicence?: string;
}
