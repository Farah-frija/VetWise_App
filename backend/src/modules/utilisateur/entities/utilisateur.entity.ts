import { Entity, Column, TableInheritance, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { Conversation } from '../../Chat/Entities/conversation.entity';
import { MeetingSession } from '../../Chat/Entities/MeetingSession.entity';
import { Message } from  '../../Chat/Entities/message.entity';



@Entity('utilisateur')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Utilisateur extends BaseEntity {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ default: false })
  estVerifie: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  @Exclude()
  verificationToken: string;

  @Column({ nullable: true })
  verificationExpires: Date;

  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => Conversation, (conversation) => conversation.participant1)
  conversationsAsParticipant1: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.participant2)
  conversationsAsParticipant2: Conversation[];
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => MeetingSession, (session) => session.participant)
  meetingSessions: MeetingSession[];
}
