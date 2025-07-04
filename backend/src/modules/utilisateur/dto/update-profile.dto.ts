import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(1, 50)
  nom: string;

  @IsString()
  @Length(1, 50)
  prenom: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s-()]{10,}$/)
  telephone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  adresse?: string;
}
