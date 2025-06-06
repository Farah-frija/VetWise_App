import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DossierMedicalService } from './dossier-medical.service';
import { CreateDossierMedicalDto } from './dto/create-dossier-medical.dto';
import { UpdateDossierMedicalDto } from './dto/update-dossier-medical.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dossier-medical') 
@Controller('dossier-medical')
export class DossierMedicalController {
  constructor(private readonly dossierMedicalService: DossierMedicalService) {}

  @Post()
  create(@Body() createDossierMedicalDto: CreateDossierMedicalDto) {
    return this.dossierMedicalService.create(createDossierMedicalDto);
  }

  @Get()
  findAll() {
    return this.dossierMedicalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dossierMedicalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDossierMedicalDto: UpdateDossierMedicalDto) {
    return this.dossierMedicalService.update(+id, updateDossierMedicalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dossierMedicalService.remove(+id);
  }
}
