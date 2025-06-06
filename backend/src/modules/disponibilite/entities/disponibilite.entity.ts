import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Veterinaire } from '../../utilisateur/entities/veterinaire.entity';
  import { BaseEntity } from '../../../common/entities/base.entity'; 
import { disponibiliteType } from '../../../common/enums/disponibilite.enum';
  
  @Entity('disponibilite')
  export class Disponibilite extends BaseEntity {

  
    @ManyToOne(() => Veterinaire, (veterinaire) => veterinaire.disponibilites, {
      eager: false,
      onDelete: 'CASCADE',
    })

    @JoinColumn({ name: 'veterinaire_id' })
    veterinaire: Veterinaire;
  
    @Column()
    jourSemaine: string;
  
    @Column({ type: 'time' })
    heureDebut: string;
  
    @Column({ type: 'time' })
    heureFin: string;
  
    @Column({ default: true })
    disponible: boolean;
  
    @Column({
        type: 'enum',
        enum: disponibiliteType,
      })
      mode: disponibiliteType;
  
    @Column({ default: false })
    estExceptionnelle: boolean;
  
    @Column({ type: 'date', nullable: true })
    dateExceptionnelle: Date;
  }
  