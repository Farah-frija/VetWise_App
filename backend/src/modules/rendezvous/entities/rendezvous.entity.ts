import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { RendezvousAnimal } from './rendezvous-animal.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { Consultation } from '../../consultation/entities/consultation.entity';
import { RendezvousStatus } from '../../../common/enums/rendezvous-status.enum';
import { Paiement } from '../../Paiement/entities/Paiement.entity';

@Entity('rendezvous')
export class Rendezvous extends BaseEntity {
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  heure: string;

  @Column({ nullable: true })
  motif: string;

  @Column()
  type: string;

  @Column({
    type: 'enum',       
    enum: RendezvousStatus,  
    default: RendezvousStatus.PENDING, 
  })
  statut: RendezvousStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Utilisateur, { eager: true })
  @JoinColumn({ name: 'veterinaire_id' }) 
  veterinaire: Utilisateur;

  @ManyToOne(() => Utilisateur, { eager: true })
  @JoinColumn({ name: 'proprietaire_id' })
  proprietaire: Utilisateur;

  @OneToMany(() => RendezvousAnimal, (ra) => ra.rendezvous, { cascade: true })
  animaux: RendezvousAnimal[];

  @OneToMany(() => Consultation, (consultation) => consultation.rendezvous)
  consultations: Consultation[];
  @OneToMany(() => Paiement, (paiement) => paiement.rendezvous)
  paiements: Paiement[];
  @Column({ name: 'lastSuccessfulPaiementId', nullable: true })
lastSuccessfulPaiementId: string | null;  // The actual ID column

@OneToOne(() => Paiement, { nullable: true })
@JoinColumn({ name: 'lastSuccessfulPaiementId' })
lastSuccessfulPaiement?: Paiement | null;  // The relation (optional)
}
