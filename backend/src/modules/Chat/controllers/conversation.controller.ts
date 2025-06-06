import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto } from '../dtos/CreateConversationdto';


@ApiTags('Conversations')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ 
    status: 201, 
    description: 'Conversation created successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'One or both users not found' 
  })
  create(@Body() dto: CreateConversationDto) {
    return this.service.create(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all conversations for a user' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user whose conversations to fetch'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of conversations' 
  })
  getUserConversations(@Param('userId') userId: number) {
    return this.service.getUserConversations(userId);
  }

  @Get(':conversationId/messages')
  @ApiOperation({ summary: 'Get conversation with messages' })
  @ApiParam({
    name: 'conversationId',
    description: 'ID of the conversation'
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID of the requesting user (for marking messages as read)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Conversation with messages' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Not authorized to access this conversation' 
  })
  getConversationWithMessages(
    @Param('conversationId') conversationId: string,
    @Query('userId') userId: number,
  ) {
    return this.service.getConversationWithMessages(conversationId, userId);
  }
}