import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ProprietaireAnimal } from '../../utilisateur/entities/proprietaire-animal.entity';
import { DossierMedical } from '../../dossier-medical/entities/dossier-medical.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Rendezvous } from '../../rendezvous/entities/rendezvous.entity';
import { Consultation } from '../../consultation/entities/consultation.entity';

@Entity()
export class Animal extends BaseEntity{

  @Column()
  nom: string;

  @Column()
  espece: string;

  @Column()
  race: string;

  @Column({ type: 'date' })
  dateNaissance: Date;

  @Column()
  sexe: string;

  @ManyToOne(() => ProprietaireAnimal, (proprietaire) => proprietaire.animaux)
  proprietaire: ProprietaireAnimal;
  @OneToOne(() => DossierMedical, (dossier) => dossier.animal, { cascade: true })
  dossierMedical: DossierMedical;
  @ManyToMany(() => Rendezvous, (rendezvous) => rendezvous.animaux)
  rendezvous: Rendezvous[];
  @OneToMany(() => Consultation, consultation => consultation.animal)
  consultations: Consultation[];


}
