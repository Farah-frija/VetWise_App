import { Module } from '@nestjs/common';
import { CliniqueService } from './clinique.service';
import { CliniqueController } from './clinique.controller';
import { Clinique } from './entities/clinique.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Clinique])],
  controllers: [CliniqueController],
  providers: [CliniqueService],
})
export class CliniqueModule {}
