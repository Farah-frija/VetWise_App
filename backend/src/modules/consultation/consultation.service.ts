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
  
    const animal = await this.animalRepo.findOne({ where: { id: data.animalId } });
    if (!animal) {
      throw new NotFoundException(`Animal with id ${data.animalId} not found`);
    }
  
    const vet = await this.vetRepo.findOne({ where: { id: data.veterinaireId } });
    if (!vet) {
      throw new NotFoundException('Vétérinaire introuvable');
    }
  
    consultation.animal = animal;
    consultation.veterinaire = vet;
  
    let rendezvous = null;
    if (data.rendezvousId) {
      rendezvous = await this.rendezvousRepo.findOne({ where: { id: data.rendezvousId } });
  
      if (!rendezvous) {
        throw new NotFoundException(`Rendezvous with id ${data.rendezvousId} not found`);
      }
  
      rendezvous.statut = RendezvousStatus.COMPLETED;
      await this.rendezvousRepo.save(rendezvous);
  
      consultation.rendezvous = rendezvous;
    }
  
    consultation.dateConsultation = new Date(data.dateConsultation);
    consultation.type = data.type;
    consultation.diagnostic = data.diagnostic;
    consultation.traitement = data.traitement;
    consultation.notes = data.notes;
  
    return this.consultationRepo.save(consultation);
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
    const consultation = await this.consultationRepo.findOneBy({ id });
    if (!consultation) throw new NotFoundException('Consultation not found');
    return this.consultationRepo.remove(consultation);
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
  
}
