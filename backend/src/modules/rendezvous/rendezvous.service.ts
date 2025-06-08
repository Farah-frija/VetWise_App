import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, MoreThanOrEqual, Repository } from 'typeorm';
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
import { startOfDay, endOfDay } from 'date-fns';
import { Consultation } from '../consultation/entities/consultation.entity';

moment.locale('fr');
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
    
    @InjectRepository(Consultation)
    private readonly consultationRepo: Repository<Consultation>,

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
  
  async getCreneauxDisponibles(
  date: string,
  veterinaireId: number,
  dureeMinutes = 30,
): Promise<string[]> {
  console.log('Fetching available time slots for date:', date, 'and vet ID:', veterinaireId);
  const jourSemaine = moment(date).format('dddd').toLowerCase();
  const disponibilites = await this.disponibiliteRepo.find({
    where: {
      veterinaire: { id: veterinaireId },
      disponible: true,
      jourSemaine: jourSemaine,
    },
  });

  if (!disponibilites.length) return [];

  const rdvs = await this.rendezvousRepo.find({
    where: {
      date,
      veterinaire: { id: veterinaireId },
    },
  });

  const reservedTimes = rdvs.map((rdv) => ({
    start: moment(rdv.heure, 'HH:mm'),
    end: moment(rdv.heure, 'HH:mm').add(dureeMinutes, 'minutes'),
  }));

  const creneauxDispo: string[] = [];

  for (const dispo of disponibilites) {
    const start = moment(dispo.heureDebut, 'HH:mm');
    const end = moment(dispo.heureFin, 'HH:mm');

    let current = start.clone();

    while (current.add(0, 'minutes').isBefore(end)) {
      const creneauStart = current.clone();
      const creneauEnd = current.clone().add(dureeMinutes, 'minutes');

      // Si dépasse fin, on skip
      if (creneauEnd.isAfter(end)) break;

      // Vérifie les conflits
      const overlap = reservedTimes.some(
        (rdv) =>
          creneauStart.isBefore(rdv.end) && creneauEnd.isAfter(rdv.start),
      );

      if (!overlap) {
        creneauxDispo.push(creneauStart.format('HH:mm'));
      }

      current = current.add(dureeMinutes, 'minutes');
    }
  }

  return creneauxDispo;
}

async findByProprietaireId(proprietaireId: number): Promise<Rendezvous[]> {
  const rendezvous = await this.rendezvousRepo.find({
    where: { proprietaire: { id: proprietaireId } },
    relations: ['veterinaire', 'animaux', 'animaux.animal'],
    order: { date: 'DESC', heure: 'DESC' },
  });

  if (!rendezvous || rendezvous.length === 0) {
    throw new NotFoundException('Aucun rendez-vous trouvé pour ce propriétaire');
  }

  return rendezvous;
}

async findUpcomingConfirmedByProprietaire(proprietaireId: number): Promise<Rendezvous[]> {
  const today = moment().startOf('day').format('YYYY-MM-DD');

  return this.rendezvousRepo.find({
    where: {
      statut: RendezvousStatus.CONFIRMED,
      date: MoreThanOrEqual(today),
      proprietaire: { id: proprietaireId },
    },
    order: { date: 'ASC', heure: 'ASC' },
    relations: ['veterinaire', 'proprietaire', 'animaux', 'animaux.animal'],
  });
}

async findByVeterinaireId(veterinaireId: number): Promise<Rendezvous[]> {
  const vet = await this.utilisateurRepository.findOne({
    where: { id: veterinaireId, role: UserRole.VETERINARIAN },
  });

  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }

  return this.rendezvousRepo.find({
    where: { veterinaire: { id: veterinaireId } },
    relations: [ 'proprietaire', 'animaux', 'animaux.animal'],
  });
}
async getConfirmedRendezvousByVeterinaireId(veterinaireId: number) {
    const vet = await this.utilisateurRepository.findOne({
    where: { id: veterinaireId, role: UserRole.VETERINARIAN },
  });

  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }
  return this.rendezvousRepo.find({
    where: {
      veterinaire: { id: veterinaireId },
      statut: RendezvousStatus.CONFIRMED,
    },
    relations: ['proprietaire', 'animaux', 'animaux.animal'], // adjust relations as needed
  });
}
// for schedule 
async getConfirmedAndCompletedRendezvousByVeterinaireId(veterinaireId: number) {
    const vet = await this.utilisateurRepository.findOne({
    where: { id: veterinaireId, role: UserRole.VETERINARIAN },
  });

  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }
  return this.rendezvousRepo.find({
    where: {
      veterinaire: { id: veterinaireId },
      statut: In([RendezvousStatus.CONFIRMED, RendezvousStatus.COMPLETED]),
    },
    relations: ['proprietaire', 'animaux', 'animaux.animal'], // adjust relations as needed
  });
}

// this function gets today's confirmed rendez-vous that are not yet fully associated to consultations for all animals
async getTodayConfirmedRendezvousByVeterinaireId(veterinaireId: number) {
  const vet = await this.utilisateurRepository.findOne({
    where: { id: veterinaireId, role: UserRole.VETERINARIAN },
  });

  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }

  const todayStart = moment().startOf('day').format('YYYY-MM-DD');
  const todayEnd = moment().endOf('day').format('YYYY-MM-DD');

  // Step 1: Get all today's confirmed rendezvous
  const allTodayConfirmed = await this.rendezvousRepo.find({
    where: {
      veterinaire: { id: veterinaireId },
      statut: RendezvousStatus.CONFIRMED,
      date: Between(todayStart, todayEnd),
    },
    relations: ['animaux', 'animaux.animal'], // fetch rendezvous_animaux and linked animal
  });

  // Step 2: Filter rendezvous where at least one animal has no consultation
  const matchingRdv = [];
  console.log("allTodayConfirmed", allTodayConfirmed);
  for (const rdv of allTodayConfirmed) {
    for (const ra of rdv.animaux) {
            console.log("in rdv")

      console.log(rdv.id)
      const consultationExists = await this.consultationRepo.findOne({
        where: {
          rendezvous: { id: rdv.id },
          animal: { id: ra.animal.id },
        },
      });
      console.log("bbb");
      console.log(consultationExists);

      if (!consultationExists) {
        matchingRdv.push(rdv);
        break; // No need to check the rest of animals in this rdv
      }
    }
  }

  return matchingRdv;
}

// This function retrieves all animals linked to a rendezvous that have not been consulted yet
async getAnimalsWithoutConsultation(rendezvousId: number): Promise<Animal[]> {
  const rendezvous = await this.rendezvousRepo.findOne({
    where: { id: rendezvousId },
    relations: ['animaux', 'animaux.animal'],
  });

  if (!rendezvous) {
    throw new NotFoundException(`Rendezvous with id ${rendezvousId} not found`);
  }

  // Get all consulted animal IDs for this rendezvous
  const consultedAnimalIdsRaw = await this.consultationRepo
    .createQueryBuilder('consultation')
    .select('consultation.animalId', 'animalId')
    .where('consultation.rendezvousId = :rdvId', { rdvId: rendezvousId })
    .getRawMany();

  const consultedAnimalIds = consultedAnimalIdsRaw.map(r => r.animalId);

  // Filter animals that are not in the consultedAnimalIds
  const unconsultedAnimals = rendezvous.animaux
    .filter(ra => !consultedAnimalIds.includes(ra.animal.id))
    .map(ra => ra.animal);

  return unconsultedAnimals;
}





}
