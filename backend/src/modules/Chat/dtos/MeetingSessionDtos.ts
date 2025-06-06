import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsIn } from 'class-validator';

// RECORD ACTION DTO
export class RecordActionDto {
  @ApiProperty({ description: 'UUID of the conversation', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  conversationId: string;

  @ApiProperty({ description: 'ID of the participant', example: 1 })
  @IsNumber()
  participantId: number;

  @ApiProperty({ enum: ['join', 'leave'], description: 'Type of action' })
  @IsIn(['join', 'leave'])
  actionType: 'join' | 'leave';
}

// RESPONSE DTOs
export class ParticipantInfo {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

export class ConversationHistoryResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: ParticipantInfo })
  participant: ParticipantInfo;

  @ApiProperty({ example: '2023-07-20T10:00:00Z' })
  actionTime: Date;

  @ApiProperty({ enum: ['join', 'leave'] })
  actionType: 'join' | 'leave';
}

// Alias for participant-specific response
export class ParticipantHistoryResponse extends ConversationHistoryResponse {}