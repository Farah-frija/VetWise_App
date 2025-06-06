import { ChildEntity, Entity } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { UserRole } from '../../../common/enums/roles.enum';
@ChildEntity('admin')
export class Administrateur extends Utilisateur {
  constructor() {
    super();
    this.role = UserRole.ADMIN;
  }
}
