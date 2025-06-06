import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateConsultationDto {
  @IsNumber()
  @ApiProperty()
  animalId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  rendezvousId?: number;

  @IsNumber()
  @ApiProperty()
  veterinaireId: number;

  @IsDateString()
  @ApiProperty()
  @Type(() => Date)
  dateConsultation: string;

  @IsString()
  @ApiProperty()
  type: string;

  @IsOptional()
  @ApiProperty()
  diagnostic?: string;

  @IsOptional()
  @ApiProperty()
  traitement?: string;

  @IsOptional()
  @ApiProperty()
  notes?: string;
}
