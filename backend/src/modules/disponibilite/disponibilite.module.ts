import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibiliteService } from './disponibilite.service';
import { DisponibiliteController } from './disponibilite.controller';
import { Disponibilite } from './entities/disponibilite.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { UtilisateurModule } from '../utilisateur/utilisateur.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Disponibilite, Utilisateur]),  
    UtilisateurModule,  
  ],
  controllers: [DisponibiliteController],
  providers: [DisponibiliteService],
  exports: [DisponibiliteService],
})
export class DisponibiliteModule {}
