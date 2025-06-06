import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    description: 'ID of the first participant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  participant1Id: number;
  @ApiProperty({
    description: 'ID of the second participant',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  participant2Id: number;
}