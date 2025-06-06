// src/modules/disponibilite/dto/update-disponibilite.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDisponibiliteDto } from './create-disponibilite.dto';

export class UpdateDisponibiliteDto extends PartialType(CreateDisponibiliteDto) {}
