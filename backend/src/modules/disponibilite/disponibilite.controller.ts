// src/modules/disponibilite/disponibilite.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibiliteService } from './disponibilite.service';
import { CreateDisponibiliteDto } from './dto/create-disponibilite.dto';
import { UpdateDisponibiliteDto } from './dto/update-disponibilite.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('disponibilité') 
@Controller('disponibilites')
export class DisponibiliteController {
  constructor(private readonly service: DisponibiliteService) {}

  @Post()
  create(@Body() dto: CreateDisponibiliteDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDisponibiliteDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('veterinaire/:vetId')
findByVeterinaire(@Param('vetId') vetId: string) {
  return this.service.findByVeterinaire(+vetId);
}

@Get('veterinaire/:vetId/jour/:jour')
findByVetAndDay(@Param('vetId') vetId: string, @Param('jour') jour: string) {
  return this.service.findByVeterinaireAndDay(+vetId, jour);
}

}
