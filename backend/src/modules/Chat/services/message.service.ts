import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { CreateMessageDto } from '../dtos/CreateMessagedto';
import { UtilisateurService } from '../../utilisateur/utilisateur.service';
import { MessageResponseDto } from '../dtos/MessageResponseDto';
import { UserProfileDto } from '../dtos/UserProfileDto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
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
      timestamp: message.timestamp || new Date(),
      isRead: message.isRead || false,
      sender: this.mapToUserProfile(message.sender)
    };
  }

  async create(dto: CreateMessageDto): Promise<MessageResponseDto> {
    const [conversation, sender] = await Promise.all([
      this.conversationRepo.findOne({ 
        where: { id: dto.conversationId },
        relations: ['participant1', 'participant2']
      }),
      this.utilisateurService.findOne(dto.senderId)
    ]);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Verify sender is part of conversation
    if (conversation.participant1.id !== sender.id && 
        conversation.participant2.id !== sender.id) {
      throw new NotFoundException('User not in conversation');
    }

    const message = this.messageRepo.create({
      content: dto.content,
      conversation,
      sender,
      timestamp: new Date(),
      isRead: false
    });

    // Update conversation last message timestamp
    conversation.lastMessageAt = new Date();
    await this.conversationRepo.save(conversation);
    
    const savedMessage = await this.messageRepo.save(message);
    return this.mapToMessageResponse(savedMessage);
  }
}