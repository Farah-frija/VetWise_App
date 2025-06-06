import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddAnimalToRendezvousDto {
  @IsInt()
  @ApiProperty()
  rendezvousId: number;

  @IsInt()
  @ApiProperty()
  animalId: number;
}
