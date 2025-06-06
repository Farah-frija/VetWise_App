import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { ProprietaireAnimal } from '../utilisateur/entities/proprietaire-animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, ProprietaireAnimal])],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
