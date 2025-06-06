import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCliniqueDto {
  @IsNotEmpty()
  @ApiProperty()
  nom: string;

  @IsNotEmpty()
  @ApiProperty()
  adresse: string;

  @IsNotEmpty()
  @ApiProperty()
  telephone: string;

  @IsNotEmpty()
  @ApiProperty()
  horairesOuverture: string;

  @IsOptional()
  @IsString()
  coordonneesGPS?: string;
}
