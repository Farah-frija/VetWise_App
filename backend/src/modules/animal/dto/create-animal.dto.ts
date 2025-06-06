import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @ApiProperty()
  nom: string;

  @IsString()
  @ApiProperty()
  espece: string;

  @IsString()
  @ApiProperty()
  race: string;

  @IsDateString()
  @ApiProperty()
  dateNaissance: Date;

  @IsString()
  @ApiProperty()
  sexe: string;

  @IsNumber()
  @ApiProperty()
  proprietaireId: number;
}
