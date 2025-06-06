// clinique.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Veterinaire } from '../../utilisateur/entities/veterinaire.entity';
import { BaseEntity } from '../../../common/entities/base.entity'; 

@Entity()
export class Clinique extends BaseEntity{

  @Column()
  nom: string;

  @Column()
  adresse: string;

  @Column()
  telephone: string;

  @Column()
  horairesOuverture: string;

  @Column({ nullable: true })
  coordonneesGPS: string;

  @OneToMany(() => Veterinaire, (vet) => vet.clinique)
  veterinaires: Veterinaire[];
}
