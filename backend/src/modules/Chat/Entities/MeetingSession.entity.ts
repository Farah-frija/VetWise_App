import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { Conversation } from './conversation.entity';


@Entity('meeting_session')
export class MeetingSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.meetings)
  conversation: Conversation;

  @ManyToOne(() => Utilisateur, (user) => user.meetingSessions)
  participant: Utilisateur;

  @Column({ type: 'timestamp' })
  actionTime: Date;

  @Column({ type: 'enum', enum: ['join', 'leave'] })
  actionType: 'join' | 'leave';
 
}