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
  export class RendezvousAnimal extends BaseEntity {
  
    @Unique(['rendezvous', 'animal'])

    @ManyToOne(() => Rendezvous, (r) => r.animaux, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rendezvous_id' })
    rendezvous: Rendezvous;
  
    @ManyToOne(() => Animal, (a) => a.rendezvous, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'animal_id' })
    animal: Animal;
  }
  