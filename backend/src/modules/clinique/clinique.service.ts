// clinique.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinique } from './entities/clinique.entity';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { UpdateCliniqueDto } from './dto/update-clinique.dto';

@Injectable()
export class CliniqueService {
  constructor(
    @InjectRepository(Clinique)
    private cliniqueRepo: Repository<Clinique>,
  ) {}

  create(dto: CreateCliniqueDto) {
    const clinique = this.cliniqueRepo.create(dto);
    return this.cliniqueRepo.save(clinique);
  }

  findAll() {
    return this.cliniqueRepo.find({ relations: ['veterinaires'] });
  }

  async findOne(id: number) {
    const clinique = await this.cliniqueRepo.findOne({ where: { id }, relations: ['veterinaires'] });
    if (!clinique) throw new NotFoundException('Clinique non trouvée');
    return clinique;
  }

  async update(id: number, dto: UpdateCliniqueDto) {
    const clinique = await this.findOne(id);
    Object.assign(clinique, dto);
    return this.cliniqueRepo.save(clinique);
  }

  async remove(id: number) {
    const clinique = await this.findOne(id);
    return this.cliniqueRepo.remove(clinique);
  }
}
