import { IsNull, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';
export class GenericService<T extends BaseEntity> {
  constructor(private repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find({ where: { deletedAt: IsNull() } as any });
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: null } as any,
    });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async create(createDto: any): Promise<T[]> {
    const entity = this.repository.create({
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repository.save(entity);
  }

  async update(id: number, updateDto: any): Promise<T> {
    await this.findOne(id);
    const updatedData = {
      ...updateDto,
      updatedAt: new Date(),
    };
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  //it is soft delete
  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    entity.deletedAt = new Date();
    await this.repository.save(entity);
  }
}
