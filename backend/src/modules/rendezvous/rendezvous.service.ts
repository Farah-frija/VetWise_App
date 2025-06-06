import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rendezvous } from './entities/rendezvous.entity';
import { RendezvousAnimal } from './entities/rendezvous-animal.entity';
import { Veterinaire } from '../utilisateur/entities/veterinaire.entity';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';
import { Animal } from '../animal/entities/animal.entity';
import { UserRole } from '../../common/enums/roles.enum';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import * as moment from 'moment';
import { Disponibilite } from '../disponibilite/entities/disponibilite.entity';
import { RendezvousStatus } from '../../common/enums/rendezvous-status.enum';

@Injectable()
export class RendezvousService {
  constructor(
    @InjectRepository(Animal)
    private animalRepo: Repository<Animal>,

    @InjectRepository(Rendezvous)
    private rendezvousRepo: Repository<Rendezvous>,

    @InjectRepository(RendezvousAnimal)
    private raRepo: Repository<RendezvousAnimal>,

    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,

    @InjectRepository(Disponibilite)
    private readonly disponibiliteRepo: Repository<Disponibilite>,
  ) {}

  async createRendezvous(dto: CreateRendezvousDto): Promise<Rendezvous> {
    console.log('Creating rendezvous with DTO:', dto);

    const vet = await this.utilisateurRepository.findOne({
      where: {
        id: dto.veterinaireId,
        role: UserRole.VETERINARIAN,
      },
    });

    if (!vet) {
      throw new NotFoundException('Vétérinaire introuvable');
    }

    const proprietaire = await this.utilisateurRepository.findOne({
      where: { id: dto.proprietaireId, role: UserRole.PET_OWNER },
    });

    if (!proprietaire) {
      throw new NotFoundException('Propriétaire introuvable');
    }
    await this.checkDisponibiliteAndConflict(
      dto.date,
      dto.heure,
      dto.veterinaireId,
    );

    const { veterinaireId, proprietaireId, ...rest } = dto;
    const rendezvous = this.rendezvousRepo.create({
      ...rest,
      veterinaire: vet,
      proprietaire: proprietaire,
    });
    console.log(rendezvous);
    return await this.rendezvousRepo.save(rendezvous);
  }

  async findAll(): Promise<Rendezvous[]> {
    return this.rendezvousRepo.find({
      relations: ['veterinaire', 'animaux', 'animaux.animal'],
    });
  }

  async findOne(id: number): Promise<Rendezvous> {
    const rdv = await this.rendezvousRepo.findOne({
      where: { id },
      relations: ['veterinaire', 'animaux', 'animaux.animal'],
    });

    if (!rdv) {
      throw new NotFoundException('Rendez-vous introuvable');
    }

    return rdv;
  }

  async update(id: number, dto: UpdateRendezvousDto): Promise<Rendezvous> {
    const rdv = await this.findOne(id);
    await this.checkDisponibiliteAndConflict(
      dto.date ?? rdv.date,
      dto.heure ?? rdv.heure,
      dto.veterinaireId ?? rdv.veterinaire.id,
      id,
    );

    if (dto.veterinaireId) {
      const vet = await this.utilisateurRepository.findOne({
        where: {
          id: dto.veterinaireId,
          role: UserRole.VETERINARIAN,
        },
      });

      if (!vet) {
        throw new NotFoundException('Vétérinaire introuvable');
      }

      rdv.veterinaire = vet;
    }

    if (dto.proprietaireId) {
      const prop = await this.utilisateurRepository.findOne({
        where: {
          id: dto.proprietaireId,
          role: UserRole.PET_OWNER,
        },
      });

      if (!prop) {
        throw new NotFoundException('Propriétaire introuvable');
      }

      rdv.proprietaire = prop;
    }

    Object.assign(rdv, dto);
    return await this.rendezvousRepo.save(rdv);
  }

  async remove(id: number): Promise<void> {
    const rdv = await this.findOne(id);
    await this.rendezvousRepo.remove(rdv);
  }

  async addAnimalToRendezvous(rendezvousId: number, animalId: number) {
    const rendezvous = await this.rendezvousRepo.findOne({
      where: { id: rendezvousId },
    });
    if (!rendezvous) {
      throw new NotFoundException(
        `Rendez-vous with id ${rendezvousId} not found`,
      );
    }

    const animal = await this.animalRepo.findOne({ where: { id: animalId } });
    if (!animal) {
      throw new NotFoundException(`Animal with id ${animalId} not found`);
    }

    const existing = await this.raRepo.findOne({
      where: { rendezvous: { id: rendezvousId }, animal: { id: animalId } },
    });

    if (existing) {
      throw new ConflictException('Animal already added to rendezvous');
    }

    const ra = this.raRepo.create({
      rendezvous,
      animal,
    });

    return await this.raRepo.save(ra);
  }

  async confirmRendezvous(id: number): Promise<Rendezvous> {
    const rendezvous = await this.rendezvousRepo.findOne({
      where: { id },
      relations: ['veterinaire', 'proprietaire'],
    });

    if (!rendezvous) {
      throw new NotFoundException('Rendez-vous introuvable');
    }

    if (rendezvous.statut === RendezvousStatus.CONFIRMED) {
      throw new ConflictException('Rendez-vous is already confirmed');
    }

    rendezvous.statut = RendezvousStatus.CONFIRMED;
    return this.rendezvousRepo.save(rendezvous);
  }

  async cancelRendezvous(id: number): Promise<Rendezvous> {
    const rendezvous = await this.rendezvousRepo.findOne({
      where: { id },
      relations: ['proprietaire'],
    });

    if (!rendezvous) {
      throw new NotFoundException('Rendez-vous introuvable');
    }

    if (rendezvous.statut === RendezvousStatus.CANCELED) {
      throw new ConflictException('Le rendez-vous est déjà annulé');
    }

    rendezvous.statut = RendezvousStatus.CANCELED;
    return this.rendezvousRepo.save(rendezvous);
  }

  async checkDisponibiliteAndConflict(
    date: string,
    heure: string,
    veterinaireId: number,
    rdvIdToExclude?: number,
    dureeMinutes: number = 30,
  ) {
    const jourSemaine = moment(date).format('dddd').toLowerCase(); // e.g., 'monday'
    const startTime = moment(heure, 'HH:mm');
    const endTime = moment(startTime).add(dureeMinutes, 'minutes');
    console.log('Checking availability for date:', date, 'and time:', heure);
    console.log('jourSemaine:', jourSemaine);
    console.log('startTime:', startTime.format('HH:mm'));
    console.log('endTime:', endTime.format('HH:mm'));
    // Step 1: Check if vet is available that day and during full slot
    const disponibilites = await this.disponibiliteRepo.find({
      where: {
        veterinaire: { id: veterinaireId },
        disponible: true,
        jourSemaine: jourSemaine,
      },
    });
    console.log('Disponibilites:', disponibilites);
    const isWithinDisponibilite = disponibilites.some((d) => {
      const dispoStart = moment(d.heureDebut, 'HH:mm');
      const dispoEnd = moment(d.heureFin, 'HH:mm');

      const isSameDay =
        !d.estExceptionnelle ||
        moment(d.dateExceptionnelle).isSame(date, 'day');

      return (
        isSameDay &&
        startTime.isSameOrAfter(dispoStart) &&
        endTime.isSameOrBefore(dispoEnd)
      );
    });

    if (!isWithinDisponibilite) {
      throw new ConflictException(
        "Le vétérinaire n'est pas disponible pendant toute la durée du rendez-vous.",
      );
    }

    // Step 2: Check for overlapping rendezvous
    const existingRendezvous = await this.rendezvousRepo.find({
      where: {
        date,
        veterinaire: { id: veterinaireId },
      },
    });

    const hasOverlap = existingRendezvous.some((rdv) => {
      if (rdv.id === rdvIdToExclude) return false;

      const rdvStart = moment(rdv.heure, 'HH:mm');
      const rdvEnd = moment(rdvStart).add(dureeMinutes, 'minutes');

      // Check for time overlap
      return startTime.isBefore(rdvEnd) && endTime.isAfter(rdvStart);
    });

    if (hasOverlap) {
      throw new ConflictException(
        'Un autre rendez-vous est déjà prévu pendant cette période.',
      );
    }
  }
}
