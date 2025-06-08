import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paiement } from './entities/Paiement.entity';
import { PaiementService } from './services/Paiement.service';
import { Rendezvous } from '../rendezvous/entities/rendezvous.entity';
import { ChatModule } from '../Chat/chat.module';
import { PaiementController } from './Paiement.controller';
import { Conversation } from '../Chat/Entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement,Rendezvous,Conversation]),ChatModule],
  providers: [PaiementService],
  controllers: [PaiementController],
})
export class PaiementModule {}