import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { ConsultationEnLigne } from './entities/consultation-enligne.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Animal } from '../animal/entities/animal.entity';
import { Rendezvous } from '../rendezvous/entities/rendezvous.entity';

import { Veterinaire } from '../utilisateur/entities/veterinaire.entity';
import { CreateConsultationEnLigneDto } from './dto/create-consultationEnLigne.dto';
import { RendezvousStatus } from '../../common/enums/rendezvous-status.enum';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepo: Repository<Consultation>,

    @InjectRepository(ConsultationEnLigne)
    private consultationEnLigneRepo: Repository<ConsultationEnLigne>,

    @InjectRepository(Animal)
    private animalRepo: Repository<Animal>,

    @InjectRepository(Rendezvous)
    private rendezvousRepo: Repository<Rendezvous>,

    @InjectRepository(Veterinaire)
    private readonly vetRepo: Repository<Veterinaire>,
    
  ) {}

async create(data: CreateConsultationDto) {
  const consultation = new Consultation();

  // Recherche animal
  const animal = await this.animalRepo.findOne({ where: { id: data.animalId } });
  if (!animal) {
    throw new NotFoundException(`Animal with id ${data.animalId} not found`);
  }

  // Recherche vétérinaire
  const vet = await this.vetRepo.findOne({ where: { id: data.veterinaireId } });
  if (!vet) {
    throw new NotFoundException('Vétérinaire introuvable');
  }

  // Assignation obligatoire
  consultation.animal = animal;
  consultation.veterinaire = vet;

  // Date consultation à maintenant (ou selon besoin)
  consultation.dateConsultation = new Date();

  // Assignation autres champs
  consultation.type = data.type;
  consultation.diagnostic = data.diagnostic || null;
  consultation.traitement = data.traitement || null;
  consultation.notes = data.notes || null;
  consultation.rendezvousId = data.rendezvousId || null;
  // Sauvegarde
  const savedConsultation = await this.consultationRepo.save(consultation);
console.log('saved consul:', consultation);

  let rendezvous = null;
  if (data.rendezvousId) {
    // Chargement complet du rendezvous (relations utiles)
    rendezvous = await this.rendezvousRepo.findOne({
      where: { id: data.rendezvousId },
      relations: ['animaux', 'animaux.animal', 'consultations',],
    });

    if (!rendezvous) {
      throw new NotFoundException(`Rendezvous with id ${data.rendezvousId} not found`);
    }

  }

  console.log('Consultation à sauvegarder:', consultation);



  // Mise à jour du statut rendezvous si tous les animaux associé au rendez vous on une consultation 
// Mise à jour du statut du rendez-vous si applicable
  if (rendezvous) {
    console.log('Rendez-vous trouvé:', rendezvous);
    // Récupère tous les IDs d’animaux associés au rendez-vous
    const expectedAnimalIds = rendezvous.animaux.map(ra => ra.animal.id);

    // Récupère les IDs distincts des animaux déjà consultés pour ce rendez-vous
    const consultedAnimalIdsRaw = await this.consultationRepo
      .createQueryBuilder('c')
      .select('DISTINCT c.animalId', 'animalId')
      .where('c.rendezvousId = :rdvId', { rdvId: rendezvous.id })
      .getRawMany();

    const consultedAnimalIds = consultedAnimalIdsRaw.map(r => Number(r.animalId));

    // Vérifie si tous les animaux du rendez-vous ont été consultés
    const allConsulted = expectedAnimalIds.every(id => consultedAnimalIds.includes(id));

    if (allConsulted) {
      rendezvous.statut = RendezvousStatus.COMPLETED;
      await this.rendezvousRepo.save(rendezvous);
    }
  } 

  return savedConsultation;
}


  
  
  

  findAll() {
    return this.consultationRepo.find({
      relations: ['animal', 'veterinaire', 'rendezvous'],
    });
  }

  findOne(id: number) {
    return this.consultationRepo.findOne({
      where: { id: id },
      relations: ['animal', 'veterinaire', 'rendezvous'],
    });
  }

  async update(id: number, data: UpdateConsultationDto) {
    const consultation = await this.consultationRepo.findOneBy({ id });
    if (!consultation) throw new NotFoundException('Consultation not found');
  
    if (data.animalId) {
      const animal = await this.animalRepo.findOne({ where: { id: data.animalId } });
      if (!animal) {
        throw new NotFoundException(`Animal with id ${data.animalId} not found`);
      }
      consultation.animal = animal;
    }
  
    if (data.veterinaireId) {
      const vet = await this.vetRepo.findOne({ where: { id: data.veterinaireId } });
      if (!vet) {
        throw new NotFoundException(`Vétérinaire with id ${data.veterinaireId} not found`);
      }
      consultation.veterinaire = vet;
    }
  
    if (data.rendezvousId !== undefined) {
      if (data.rendezvousId) {
        const rendezvous = await this.rendezvousRepo.findOne({ where: { id: data.rendezvousId } });
        if (!rendezvous) {
          throw new NotFoundException(`Rendezvous with id ${data.rendezvousId} not found`);
        }
        consultation.rendezvous = rendezvous;
      } else {
        consultation.rendezvous = null;
      }
    }
  
    Object.assign(consultation, {
      dateConsultation: data.dateConsultation ? new Date(data.dateConsultation) : consultation.dateConsultation,
      type: data.type ?? consultation.type,
      diagnostic: data.diagnostic ?? consultation.diagnostic,
      traitement: data.traitement ?? consultation.traitement,
      notes: data.notes ?? consultation.notes,
    });
  
    return this.consultationRepo.save(consultation);
  }
  

async remove(id: number) {
  const consultation = await this.consultationRepo.findOne({
    where: { id },
    relations: ['rendezvous'],
  });

  if (!consultation) throw new NotFoundException('Consultation not found');

  const rendezvous = consultation.rendezvous;

  // Remove the consultation
  await this.consultationRepo.remove(consultation);

  // If the consultation was linked to a rendezvous and its status was COMPLETED
  if (rendezvous && rendezvous.statut === RendezvousStatus.COMPLETED) {
    const fullRdv = await this.rendezvousRepo.findOne({
      where: { id: rendezvous.id },
    });

    fullRdv.statut = RendezvousStatus.CONFIRMED;
    await this.rendezvousRepo.save(fullRdv);
  }

  return { message: 'Consultation deleted successfully' };
}


  async createEnLigne(data: CreateConsultationEnLigneDto) {
    const consultation = new ConsultationEnLigne();
  
    const animal = await this.animalRepo.findOne({ where: { id: data.animalId } });
    if (!animal) throw new NotFoundException(`Animal with id ${data.animalId} not found`);
  
    const vet = await this.vetRepo.findOne({ where: { id: data.veterinaireId } });
    if (!vet) throw new NotFoundException('Vétérinaire introuvable');
  
    let rendezvous = null;
    if (data.rendezvousId) {
      rendezvous = await this.rendezvousRepo.findOne({ where: { id: data.rendezvousId } });
      if (!rendezvous) throw new NotFoundException(`Rendezvous with id ${data.rendezvousId} not found`);
    }
  
    consultation.animal = animal;
    consultation.veterinaire = vet;
    consultation.rendezvous = rendezvous;
    consultation.dateConsultation = new Date(data.dateConsultation);
    consultation.type = data.type;
    consultation.diagnostic = data.diagnostic;
    consultation.traitement = data.traitement;
    consultation.notes = data.notes;
  
    // En ligne specific fields
    consultation.lien = data.lien;
    consultation.contenu = data.contenu;
    consultation.typeAppel = data.typeAppel;
    consultation.enregistrementURL = data.enregistrementURL;
  
    return this.consultationEnLigneRepo.save(consultation);
  }
  
  async findByAnimal(animalId: number) {
    const animal = await this.animalRepo.findOne({ where: { id: animalId } });
    if (!animal) {
      throw new NotFoundException(`Animal with id ${animalId} not found`);
    }
  
    return this.consultationRepo.find({
      where: { animal: { id: animalId } },
      relations: ['animal', 'veterinaire', 'rendezvous'],
    });
  }

  async findByProprietaire(proprietaireId: number) {
    const animals = await this.animalRepo.find({
      where: { proprietaire: { id: proprietaireId } },
    });
  
    if (!animals.length) {
      throw new NotFoundException(`No animals found for proprietor with id ${proprietaireId}`);
    }
  
    const consultations = await this.consultationRepo.find({
      where: {
        animal: {
          id: In(animals.map(a => a.id)),
        },
      },
      relations: ['animal', 'veterinaire', 'rendezvous'],
    });
  
    return consultations;
  }
  
async findByVeterinaire(veterinaireId: number) {
  const consultations = await this.consultationRepo
    .createQueryBuilder('consultation')
    .leftJoinAndSelect('consultation.animal', 'animal')
    .leftJoinAndSelect('animal.proprietaire', 'proprietaire')
    .leftJoinAndSelect('consultation.rendezvous', 'rendezvous')
    .where('consultation.veterinaireId = :veterinaireId', { veterinaireId })
    .getMany();

  // Manually remove duplicated or unnecessary data before returning
  return consultations.map(c => {
    if (c.rendezvous) {
      delete c.rendezvous.veterinaire;
      delete c.rendezvous.proprietaire;
    }
    return c;
  });
}



}
