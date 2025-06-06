import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { AnimalModule } from './modules/animal/animal.module';
import { CliniqueModule } from './modules/clinique/clinique.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { DossierMedicalModule } from './modules/dossier-medical/dossier-medical.module';
import { DisponibiliteModule } from './modules/disponibilite/disponibilite.module';

import {
  AppDataSource,
  databaseConfig,
  jwtConfig,
  mailConfig,
} from './config/configuration';
//import { AppDataSource } from './config/database.config';
import { RendezvousModule } from './modules/rendezvous/rendezvous.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { ChatModule } from './modules/Chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, mailConfig],
    
    }),
    TypeOrmModule.forRootAsync({
      
      useFactory: async () => ({
        ...AppDataSource.options,
      }),
      
    }),
    UtilisateurModule,
    AnimalModule,
    DossierMedicalModule,
    CliniqueModule,
    ChatModule,
    AuthModule,
    MailModule,
    DisponibiliteModule,
    RendezvousModule,
    ConsultationModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
