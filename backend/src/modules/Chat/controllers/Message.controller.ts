import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDto } from '../dtos/CreateMessagedto';
import { MessageService } from '../services/message.service';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a new message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }

  

 



}