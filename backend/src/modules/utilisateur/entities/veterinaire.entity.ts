import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ChildEntity,
  OneToMany,
} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Clinique } from '../../clinique/entities/clinique.entity';
import { UserRole } from '../../../common/enums/roles.enum';
import { Disponibilite } from '../../disponibilite/entities/disponibilite.entity';
import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { Consultation } from '../../consultation/entities/consultation.entity';
import { Conversation } from 'src/modules/Chat/Entities/conversation.entity';
@ChildEntity('veterinarian')
export class Veterinaire extends Utilisateur {
  constructor() {
    super();
    this.role = UserRole.VETERINARIAN;
  }

  @Column({ unique: true })
  @Column()
  numLicence: string;

  @Column()
  specialites: string;

  @ManyToOne(() => Clinique, (clinique) => clinique.veterinaires)
  clinique: Clinique;

  @OneToMany(() => Disponibilite, (dispo) => dispo.veterinaire)
  disponibilites: Disponibilite[];

  @OneToMany(() => Rendezvous, (rendezvous) => rendezvous.veterinaire)
  rendezvous: Rendezvous[];

  @OneToMany(() => Consultation, consultation => consultation.veterinaire)
  consultations: Consultation[];

 
}
