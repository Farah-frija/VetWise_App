import { CreateConsultationDto } from './create-consultation.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsultationEnLigneDto extends CreateConsultationDto {
  @IsString()
  @ApiProperty()
  lien: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  contenu?: string;

  @IsString()
  @ApiProperty()
  typeAppel: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  enregistrementURL?: string;
}
