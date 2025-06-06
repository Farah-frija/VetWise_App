import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateConsultationEnLigneDto } from './dto/create-consultationEnLigne.dto';

@ApiTags('Consultations') 
@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  create(@Body() data: CreateConsultationDto) {
    return this.consultationService.create(data);
  }
  @Post('en-ligne')
  createEnLigne(@Body() data: CreateConsultationEnLigneDto) {
    return this.consultationService.createEnLigne(data);
  }
  @Get()
  findAll() {
    return this.consultationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.consultationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateConsultationDto) {
    return this.consultationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.consultationService.remove(id);
  }

  @Get('by-animal/:id')
getByAnimal(@Param('id', ParseIntPipe) id: number) {
  return this.consultationService.findByAnimal(id);
}

@Get('by-proprietaire/:id')
getByProprietaire(@Param('id', ParseIntPipe) id: number) {
  return this.consultationService.findByProprietaire(id);
}

}
