import { ChildEntity, Entity, OneToMany } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Animal } from '../../animal/entities/animal.entity';
import { UserRole } from '../../../common/enums/roles.enum';
@ChildEntity('pet_owner')
export class ProprietaireAnimal extends Utilisateur {
  constructor() {
    super();
    this.role = UserRole.PET_OWNER;
  }
  @OneToMany(() => Animal, (animal) => animal.proprietaire)
  animaux: Animal[];
}
