import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDossierMedicalDto {
  @ApiProperty()
  @IsInt()
  animalId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  antecedants?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty()
  @IsString()
  etatsante: string;

  @ApiProperty()
  @IsNumber()
  poids: number;
}
