import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './UserProfileDto';


export class MessageResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you doing today?',
  })
  content: string;

  @ApiProperty({
    description: 'When the message was sent',
    example: '2023-01-01T12:00:00.000Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Whether the message has been read by the recipient',
    example: false,
  })
  isRead: boolean;

  @ApiProperty({
    description: 'User who sent the message',
    type: UserProfileDto ,
  })
  sender: UserProfileDto ;
}