import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './TokenGeneration.Controller';
import { MessageController } from './controllers/Message.controller';
import { UtilisateurModule } from '../utilisateur/utilisateur.module';
import { Conversation } from './Entities/conversation.entity';
import { Message } from './Entities/message.entity';
import { MeetingSession } from './Entities/MeetingSession.entity';
import { MessageService } from './services/message.service';
import { ConversationService } from './services/conversation.service';
import { ConversationController } from './controllers/conversation.controller';
import { MeetingHistoryService } from './services/MeetingSessionHistory';
import { MeetingHistoryController } from './controllers/MeetingSession.controller';

@Module({
     imports: [
       TypeOrmModule.forFeature([Conversation, Message,MeetingSession]),  
       UtilisateurModule,  
     ],
  controllers: [ChatController,MessageController,ConversationController,MeetingHistoryController],
  providers: [MessageService,ConversationService,MeetingHistoryService],
})
export class ChatModule {}