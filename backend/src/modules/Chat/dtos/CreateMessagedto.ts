import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The UUID of the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  conversationId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user sending the message',
    example: 1,
    required: true,
  })
  senderId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how can I help you today?',
    minLength: 1,
    maxLength: 2000,
    required: true,
  })
  content: string;
}