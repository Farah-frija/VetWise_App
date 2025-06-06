// src/modules/disponibilite/disponibilite.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisponibiliteDto } from './dto/create-disponibilite.dto';
import { UpdateDisponibiliteDto } from './dto/update-disponibilite.dto';
import { Disponibilite } from './entities/disponibilite.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { UserRole } from '../../common/enums/roles.enum';
import { disponibiliteType } from '../../common/enums/disponibilite.enum';

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
