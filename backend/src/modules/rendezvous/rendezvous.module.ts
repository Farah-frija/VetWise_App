import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rendezvous } from './entities/rendezvous.entity';
import { RendezvousAnimal } from './entities/rendezvous-animal.entity';
import { RendezvousService } from './rendezvous.service';
import { RendezvousController } from './rendezvous.controller';
import { Veterinaire } from '../utilisateur/entities/veterinaire.entity';
import { Animal } from '../animal/entities/animal.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { Disponibilite } from '../disponibilite/entities/disponibilite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rendezvous, RendezvousAnimal, Utilisateur, Animal, Disponibilite])],
  providers: [RendezvousService],
  controllers: [RendezvousController],
})
export class RendezvousModule {}
