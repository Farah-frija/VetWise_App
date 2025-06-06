// src/modules/disponibilite/disponibilite.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisponibiliteDto } from './dto/create-disponibilite.dto';
import { UpdateDisponibiliteDto } from './dto/update-disponibilite.dto';
import { Disponibilite } from './entities/disponibilite.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { UserRole } from '../../common/enums/roles.enum';
import { disponibiliteType } from '../../common/enums/disponibilite.enum';
import * as moment from 'moment';

@Injectable()
export class DisponibiliteService {
  constructor(
    @InjectRepository(Disponibilite)
    private readonly dispoRepo: Repository<Disponibilite>,

    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

async create(dto: CreateDisponibiliteDto): Promise<Disponibilite> {
  const vet = await this.utilisateurRepository.findOne({
    where: {
      id: dto.veterinaireId,
      role: UserRole.VETERINARIAN,
    },
  });

  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }

  // Récupère les dispos existantes du même jour
  const existingDispos = await this.dispoRepo.find({
    where: {
      veterinaire: { id: dto.veterinaireId },
      jourSemaine: dto.jourSemaine,
      disponible: true,
    },
  });

  const newStart = moment(dto.heureDebut, 'HH:mm');
  const newEnd = moment(dto.heureFin, 'HH:mm');

  // Vérifie le chevauchement
  for (const dispo of existingDispos) {
    const start = moment(dispo.heureDebut, 'HH:mm');
    const end = moment(dispo.heureFin, 'HH:mm');

    const isOverlap = newStart.isBefore(end) && start.isBefore(newEnd);
    if (isOverlap) {
      throw new BadRequestException(
        `Chevauchement détecté avec une disponibilité existante de ${start.format(
          'HH:mm',
        )} à ${end.format('HH:mm')}`,
      );
    }
  }

  const disponibilite = this.dispoRepo.create({
    ...dto,
    mode: dto.mode as disponibiliteType,
    veterinaire: vet,
  });

  return this.dispoRepo.save(disponibilite);
}


  findAll(): Promise<Disponibilite[]> {
    return this.dispoRepo.find({ relations: ['veterinaire'] });
  }

  findOne(id: number): Promise<Disponibilite> {
    return this.dispoRepo.findOne({
      where: { id },
      relations: ['veterinaire'],
    });
  }

  async update(
    id: number,
    dto: UpdateDisponibiliteDto,
  ): Promise<Disponibilite> {
    const dispo = await this.findOne(id);
    Object.assign(dispo, dto);
    return this.dispoRepo.save(dispo);
  }

  async remove(id: number): Promise<void> {
    const dispo = await this.findOne(id);
    await this.dispoRepo.remove(dispo);
  }

  async findByVeterinaire(vetId: number): Promise<Disponibilite[]> {
    return this.dispoRepo.find({
      where: { veterinaire: { id: vetId } },
      order: { jourSemaine: 'ASC' },
    });
  }

  async findByVeterinaireAndDay(
    vetId: number,
    jourSemaine: string,
  ): Promise<Disponibilite[]> {
    return this.dispoRepo.find({
      where: {
        veterinaire: { id: vetId },
        jourSemaine,
      },
      order: { heureDebut: 'ASC' },
    });
  }
}
