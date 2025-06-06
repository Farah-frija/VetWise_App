import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { disponibiliteType } from '../../../common/enums/disponibilite.enum';

export class CreateDisponibiliteDto {
  @IsString()
  @ApiProperty()
  jourSemaine: string;

  @IsString()
  @ApiProperty()
  heureDebut: string;

  @IsString()
  @ApiProperty()
  heureFin: string;

  @IsBoolean()
  @ApiProperty()
  disponible?: boolean;

  @IsString()
  @ApiProperty()
  @IsEnum(disponibiliteType)
  mode: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false })
  estExceptionnelle?: boolean;

  @IsOptional()
  @ApiProperty()
  dateExceptionnelle?: Date;

  @ApiProperty()
  veterinaireId: number;
}
