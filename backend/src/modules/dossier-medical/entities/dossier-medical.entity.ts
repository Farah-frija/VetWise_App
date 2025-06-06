import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Animal } from '../../animal/entities/animal.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('dossier_medical')
export class DossierMedical extends BaseEntity {

  @OneToOne(() => Animal, (animal) => animal.dossierMedical)
  @JoinColumn()
  animal: Animal;

  @Column({ nullable: true })
  observations: string;

  @Column({ nullable: true })
  antecedants: string;

  @Column({ nullable: true })
  allergies: string;

  @Column()
  etatsante: string;

  @Column('float')
  poids: number;


}
