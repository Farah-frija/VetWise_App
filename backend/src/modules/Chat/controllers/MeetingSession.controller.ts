import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { MeetingHistoryService } from '../services/MeetingSessionHistory';
import { RecordActionDto, ConversationHistoryResponse, ParticipantHistoryResponse } from '../dtos/MeetingSessionDtos';


@ApiTags('Meeting History')
@Controller('meeting-history')
export class MeetingHistoryController {
  constructor(private readonly historyService: MeetingHistoryService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record a join/leave action' })
  @ApiBody({ type: RecordActionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Action recorded successfully',
    type: ConversationHistoryResponse
  })
  @ApiResponse({ status: 404, description: 'Conversation or participant not found' })
  async recordAction(@Body() dto: RecordActionDto) {
    return this.historyService.recordAction(
      dto.conversationId,
      dto.participantId,
      dto.actionType
    );
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Get full history for a conversation' })
  @ApiParam({ name: 'conversationId', description: 'UUID of the conversation' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all join/leave events',
    type: [ConversationHistoryResponse]
  })
  async getConversationHistory(
    @Param('conversationId') conversationId: string
  ) {
    return this.historyService.getConversationHistory(conversationId);
  }

  @Get('participant/:conversationId/:participantId')
  @ApiOperation({ summary: 'Get history for a specific participant' })
  @ApiParam({ name: 'conversationId', description: 'UUID of the conversation' })
  @ApiParam({ name: 'participantId', description: 'ID of the participant' })
  @ApiResponse({ 
    status: 200, 
    description: 'Participant join/leave timeline',
    type: [ParticipantHistoryResponse]
  })
  async getParticipantHistory(
    @Param('conversationId') conversationId: string,
    @Param('participantId') participantId: number
  ) {
    return this.historyService.getParticipantHistory(
      conversationId,
      Number(participantId)
    );
  }
}