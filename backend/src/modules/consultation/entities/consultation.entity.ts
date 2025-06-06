import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, TableInheritance } from 'typeorm';
import { Animal } from '../../animal/entities/animal.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { Veterinaire } from '../../utilisateur/entities/veterinaire.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Consultation extends BaseEntity {

  @ManyToOne(() => Animal, (animal) => animal.consultations)
  animal: Animal;

  @ManyToOne(() => Rendezvous, (rdv) => rdv.consultations, { nullable: true })
  rendezvous: Rendezvous;

  @ManyToOne(() => Veterinaire, (vet) => vet.consultations)
  veterinaire: Veterinaire;

  @Column({ type: 'timestamp' })
  dateConsultation: Date;

  @Column()
  type: string;

  @Column({ nullable: true })
  diagnostic: string;

  @Column({ nullable: true })
  traitement: string;

  @Column({ nullable: true })
  notes: string;

}