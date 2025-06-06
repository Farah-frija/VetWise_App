import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Matches,
} from 'class-validator';
import { RendezvousStatus } from '../../../common/enums/rendezvous-status.enum';

export class CreateRendezvousDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'date' })
  date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Heure must be in HH:mm format',
  })  
  @ApiProperty({ type: String, format: 'time' })
  heure: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  motif?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^(online|inplace|both)$/)
  type?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  statut: RendezvousStatus;  

  @IsString()
  @IsOptional()
  @ApiProperty()
  notes?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  veterinaireId: number;

  
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  proprietaireId: number;
}
