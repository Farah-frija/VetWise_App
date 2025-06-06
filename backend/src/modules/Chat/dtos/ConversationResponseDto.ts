import { ApiProperty } from '@nestjs/swagger';

import { UserProfileDto } from './UserProfileDto';
import { MessageResponseDto } from './MessageResponseDto';

export class ConversationResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the conversation',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  id: string;

  @ApiProperty({
    description: 'When the conversation was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the last message was sent',
    example: '2023-01-01T12:00:00.000Z',
    nullable: true,
  })
  lastMessageAt: Date | null;
  @ApiProperty({
    description: 'Last Message',
    example: '2023-01-01T12:00:00.000Z',
    nullable: true,
  })
  lastMessage: string | null;

  @ApiProperty({
    description: 'The other participant in the conversation',
    type: UserProfileDto,
  })
  otherParticipant: UserProfileDto;


  @ApiProperty({
    description: 'Array of messages in the conversation',
    type: [MessageResponseDto],
    required: false,
  })
  messages?: MessageResponseDto[];
}