import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { Consultation } from './entities/consultation.entity';
import { ConsultationEnLigne } from './entities/consultation-enligne.entity';
import { Animal } from '../animal/entities/animal.entity';
import { Rendezvous } from '../rendezvous/entities/rendezvous.entity';
import { Veterinaire } from '../utilisateur/entities/veterinaire.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consultation,
      ConsultationEnLigne,
      Animal,
      Rendezvous,
      Veterinaire,
    ]),
  ],
  providers: [ConsultationService],
  controllers: [ConsultationController],
})
export class ConsultationModule {}
