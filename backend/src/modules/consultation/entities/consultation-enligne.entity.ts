import { ChildEntity, Column } from 'typeorm';
import { Consultation } from './consultation.entity';

@ChildEntity()
export class ConsultationEnLigne extends Consultation {
  @Column()
  lien: string;

  @Column({ nullable: true })
  contenu: string;

  @Column()
  typeAppel: string;

  @Column({ nullable: true })
  enregistrementURL: string;
}