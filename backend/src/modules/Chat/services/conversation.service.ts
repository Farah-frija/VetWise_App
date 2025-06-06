import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
import { Message } from '../entities/message.entity';
import { CreateConversationDto } from '../dtos/CreateConversationdto';
import { ConversationResponseDto } from '../dtos/ConversationResponseDto';
import { UserProfileDto } from '../dtos/UserProfileDto';
import { MessageResponseDto } from '../dtos/MessageResponseDto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly utilisateurService: UtilisateurService,
  ) {}

  private mapToUserProfile(user: any): UserProfileDto {
    return {
      id: user.id,
      fullName: `${user.prenom} ${user.nom}`,
      profileImage: user.profileImage,
      role: user.role,
      isOnline: false
    };
  }

  private mapToMessageResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp,
      isRead: message.isRead,
      sender: this.mapToUserProfile(message.sender)
    };
  }

  private mapToConversationResponse(
    conversation: Conversation,
    currentUserId: number,
    includeMessages: boolean = false
  ): ConversationResponseDto {
    const otherParticipant = conversation.participant1.id == currentUserId
      ? conversation.participant2
      : conversation.participant1;

    return {
      id: conversation.id,
      createdAt: conversation.createdAt,
      lastMessageAt: conversation.lastMessageAt,
      lastMessage:null,
      otherParticipant: this.mapToUserProfile(otherParticipant),
      messages: includeMessages 
        ? conversation.messages?.map(message => this.mapToMessageResponse(message))
        : undefined
    };
  }

  async create(dto: CreateConversationDto): Promise<ConversationResponseDto> {
    const [participant1, participant2] = await Promise.all([
      this.utilisateurService.findOne(dto.participant1Id),
      this.utilisateurService.findOne(dto.participant2Id),
    ]);
    console.log(dto.participant1Id);
    console.log(dto.participant2Id);

    if (!participant1 || !participant2) {
      throw new NotFoundException('One or both users not found');
    }

    const existing = await this.conversationRepo.findOne({
      where: [
        { participant1: { id: participant1.id }, participant2: { id: participant2.id } },
        { participant1: { id: participant2.id }, participant2: { id: participant1.id } },
      ],
      relations: ['participant1', 'participant2'],
    });

    if (existing) {
      throw new BadRequestException('Conversation already exists between these users');
    }

    if (participant1.id === participant2.id) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    const conversation = this.conversationRepo.create({
      participant1,
      participant2,
    });

    const savedConversation = await this.conversationRepo.save(conversation);
    return this.mapToConversationResponse(savedConversation, dto.participant1Id);
  }

  async getConversationWithMessages(
    conversationId: string, 
    userId: number
  ): Promise<ConversationResponseDto> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['participant1', 'participant2', 'messages', 'messages.sender'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1.id !=userId && conversation.participant2.id !=userId) {
      throw new NotFoundException('Not authorized to access this conversation');
    }

    await this.messageRepo.update(
      { conversation: { id: conversationId }, isRead: false, sender: { id: Not(userId) } },
      { isRead: true }
    );

    return this.mapToConversationResponse(conversation, userId, true);
  }

  async getUserConversations(userId: number): Promise<ConversationResponseDto[]> {
    const user = await this.utilisateurService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get conversations with participants
    const conversations = await this.conversationRepo.find({
      where: [
        { participant1: { id: userId } },
        { participant2: { id: userId } },
      ],
      relations: ['participant1', 'participant2'],
      order: { lastMessageAt: 'DESC' },
    });

    // Get last messages in a single query
    const conversationIds = conversations.map(c => c.id);
    const lastMessages = await this.messageRepo.find({
      where: {
        conversation: { id: In(conversationIds) }
      },
      relations: ['conversation', 'sender'],
      order: { timestamp: 'DESC' },
    });

    // Group last messages by conversation
    const lastMessageMap = new Map<string, Message>();
    lastMessages.forEach(message => {
      if (!lastMessageMap.has(message.conversation.id)) {
        lastMessageMap.set(message.conversation.id, message);
      }
    });

    // Map to response DTO
    return conversations.map(conv => {
      const lastMessage = lastMessageMap.get(conv.id);
      const otherParticipant = conv.participant1.id ==userId 
        ? conv.participant2 
        : conv.participant1;

      return {
        id: conv.id,
        createdAt: conv.createdAt,
        lastMessageAt: conv.lastMessageAt,
        lastMessage: lastMessage?.content || null,
        otherParticipant: this.mapToUserProfile(otherParticipant),
        messages: undefined
      };
    });
}
}