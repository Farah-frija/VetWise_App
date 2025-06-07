import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ProprietaireAnimal } from '../utilisateur/entities/proprietaire-animal.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
    @InjectRepository(ProprietaireAnimal)
    private proprioRepository: Repository<ProprietaireAnimal>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const proprietaire = await this.proprioRepository.findOne({
      where: { id: createAnimalDto.proprietaireId },
    });

    if (!proprietaire) throw new NotFoundException('Propriétaire non trouvé');

    const animal = this.animalRepository.create({
      ...createAnimalDto,
      proprietaire,
    });

    return this.animalRepository.save(animal);
  }

  findAll(): Promise<Animal[]> {
    return this.animalRepository.find();
  }

  findOne(id: number): Promise<Animal> {
    return this.animalRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.animalRepository.findOne({ where: { id } });
    if (!animal) throw new NotFoundException('Animal non trouvé');

    // Si on veut changer le propriétaire
    if (updateDto.proprietaireId) {
      const nouveauProprio = await this.proprioRepository.findOne({
        where: { id: updateDto.proprietaireId },
      });
      if (!nouveauProprio)
        throw new NotFoundException('Nouveau propriétaire non trouvé');
      animal.proprietaire = nouveauProprio;
    }

    // Met à jour les autres champs
    Object.assign(animal, updateDto);

    return this.animalRepository.save(animal);
  }

  async remove(id: number): Promise<void> {
    const result = await this.animalRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Animal non trouvé');
  }

  findByProprietaire(proprietaireId: number): Promise<Animal[]> {
    return this.animalRepository.find({
      where: { proprietaire: { id: proprietaireId } },
    });
  }
}
