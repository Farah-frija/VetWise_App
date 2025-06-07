
import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { PaiementStatus } from '../../../common/enums/paiement.enum';
import { Conversation } from '../../Chat/Entities/conversation.entity';


import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('paiement')
export class Paiement {
  @PrimaryColumn() // Changed from PrimaryGeneratedColumn
  id: string; // Will be manually set to paymentId from Flouci

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaiementStatus,
    default: PaiementStatus.PENDING,
  })
  status: PaiementStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => Rendezvous, (rendezvous) => rendezvous.paiements, {
    onDelete: 'CASCADE',
    eager: true, 
  })
  rendezvous: Rendezvous;
}