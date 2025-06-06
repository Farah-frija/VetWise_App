import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';


@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => Utilisateur)
  sender: Utilisateur;

  @Column('text')
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: false })
  isRead: boolean;
}