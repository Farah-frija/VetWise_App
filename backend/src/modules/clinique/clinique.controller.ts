import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CliniqueService } from './clinique.service';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { UpdateCliniqueDto } from './dto/update-clinique.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('clinique') 
@Controller('clinique')
export class CliniqueController {
  constructor(private readonly cliniqueService: CliniqueService) {}

  @Post()
  create(@Body() createCliniqueDto: CreateCliniqueDto) {
    return this.cliniqueService.create(createCliniqueDto);
  }

  @Get()
  findAll() {
    return this.cliniqueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cliniqueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCliniqueDto: UpdateCliniqueDto) {
    return this.cliniqueService.update(+id, updateCliniqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cliniqueService.remove(+id);
  }
}
