import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Conversation } from "../Entities/conversation.entity";
import { MeetingSession } from "../Entities/MeetingSession.entity";
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
import { ParticipantInfo, ConversationHistoryResponse } from "../dtos/MeetingSessionDtos";


@Injectable()
export class MeetingHistoryService {
  constructor(
    @InjectRepository(MeetingSession)
    private readonly historyRepo: Repository<MeetingSession>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    private readonly utilisateurService: UtilisateurService
  ) {}

  private mapToParticipantInfo(participant: any): ParticipantInfo {
    return {
      id: participant.id,
      fullName: `${participant.prenom} ${participant.nom}`
    };
  }

  private mapToHistoryResponse(session: MeetingSession): ConversationHistoryResponse {
    return {
      id: session.id,
      participant: this.mapToParticipantInfo(session.participant),
      actionTime: session.actionTime,
      actionType: session.actionType
    };
  }

  async recordAction(
    conversationId: string,
    participantId: number,
    actionType: 'join' | 'leave'
  ): Promise<ConversationHistoryResponse> {
    const [conversation, participant] = await Promise.all([
      this.conversationRepo.findOne({
        where: { id: conversationId },
        relations: ['participant1', 'participant2']
      }),
      this.utilisateurService.findOne(participantId)
    ]);

    if (!conversation) throw new NotFoundException('Conversation not found');
    if (!participant) throw new NotFoundException('Participant not found');

    // Verify participant is in conversation
    if (conversation.participant1.id !== participantId && 
        conversation.participant2.id !== participantId) {
      throw new ForbiddenException('User is not a participant in this conversation');
    }

    const session = await this.historyRepo.save({
      conversation,
      participant,
      actionType,
      actionTime: new Date()
    });

    return this.mapToHistoryResponse(session);
  }

  async getConversationHistory(
    conversationId: string
  ): Promise<ConversationHistoryResponse[]> {
    const sessions = await this.historyRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['participant'],
      order: { actionTime: 'ASC' }
    });

    return sessions.map(session => this.mapToHistoryResponse(session));
  }

  async getParticipantHistory(
    conversationId: string,
    participantId: number
  ): Promise<ConversationHistoryResponse[]> {
    const sessions = await this.historyRepo.find({
      where: { 
        conversation: { id: conversationId },
        participant: { id: participantId }
      },
      relations: ['participant'],
      order: { actionTime: 'ASC' }
    });

    return sessions.map(session => this.mapToHistoryResponse(session));
  }
}