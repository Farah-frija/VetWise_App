import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Unique,
  } from 'typeorm';
  import { Rendezvous } from './rendezvous.entity';
  import { Animal } from '../../animal/entities/animal.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
  
  @Entity('rendezvous_animaux')
  @Unique('UQ_rdv_animal', ['rendezvous', 'animal']) // Ajoute un nom explicite

  export class RendezvousAnimal extends BaseEntity {


    @ManyToOne(() => Rendezvous, (r) => r.animaux, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rendezvous_id' })
    rendezvous: Rendezvous;
  
    @ManyToOne(() => Animal, (a) => a.rendezvous, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'animal_id' })
    animal: Animal;
  }
  