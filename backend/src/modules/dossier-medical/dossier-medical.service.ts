import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DossierMedical } from './entities/dossier-medical.entity';
import { CreateDossierMedicalDto } from './dto/create-dossier-medical.dto';
import { UpdateDossierMedicalDto } from './dto/update-dossier-medical.dto';
import { Animal } from '../../modules/animal/entities/animal.entity';

@Injectable()
export class DossierMedicalService {
  constructor(
    @InjectRepository(DossierMedical)
    private dossierRepo: Repository<DossierMedical>,
    @InjectRepository(Animal)
    private animalRepo: Repository<Animal>,
  ) {}

  async create(createDto: CreateDossierMedicalDto) {
    const animal = await this.animalRepo.findOne({ where: { id: createDto.animalId }, relations: ['dossierMedical'] });

    if (!animal) throw new NotFoundException('Animal non trouvé');

    if (animal.dossierMedical)
      throw new Error('Cet animal a déjà un dossier médical.');

    const dossier = this.dossierRepo.create({
      ...createDto,
      animal,
    });
    
    return this.dossierRepo.save(dossier);
  }

  findAll() {
    return this.dossierRepo.find({ relations: ['animal'] });
  }

  findOne(id: number) {
    return this.dossierRepo.findOne({ where: { id }, relations: ['animal'] });
  }

  async update(id: number, updateDto: UpdateDossierMedicalDto) {
    const dossier = await this.dossierRepo.findOneBy({ id });
    if (!dossier) throw new NotFoundException('Dossier non trouvé');

    if (updateDto.animalId) {
      const animal = await this.animalRepo.findOneBy({ id: updateDto.animalId });
      if (!animal) throw new NotFoundException('Animal non trouvé');
      dossier.animal = animal;
    }
    Object.assign(dossier, updateDto); 


    return this.dossierRepo.save(dossier);
  }

  async remove(id: number) {
    const dossier = await this.dossierRepo.findOneBy({ id });
    if (!dossier) throw new NotFoundException('Dossier non trouvé');
    return this.dossierRepo.remove(dossier);
  }
}
