

import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, Column } from 'typeorm';
import { Message } from './message.entity';
import { MeetingSession } from './MeetingSession.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Utilisateur, { eager: true })
  participant1: Utilisateur;

  @ManyToOne(() => Utilisateur, { eager: true })
  participant2: Utilisateur;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastMessageAt: Date;
 
  // Relations
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => MeetingSession, (session) => session.conversation)
  meetings: MeetingSession[];
}