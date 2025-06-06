import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rendezvous') 
@Controller('rendezvous')
export class RendezvousController {
  constructor(private readonly rendezvousService: RendezvousService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateRendezvousDto) {
    return this.rendezvousService.createRendezvous(dto);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.rendezvousService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rendezvousService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRendezvousDto,
  ) {
    return this.rendezvousService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rendezvousService.remove(id);
  }

  // ADD ANIMAL TO RDV
  @Post(':id/animal/:animalId')
  addAnimal(
    @Param('id', ParseIntPipe) rendezvousId: number,
    @Param('animalId', ParseIntPipe) animalId: number,
  ) {
    return this.rendezvousService.addAnimalToRendezvous(
      rendezvousId,
      animalId,
    );
  }

  @Patch(':id/cancel')
cancelRendezvous(@Param('id', ParseIntPipe) id: number) {
  return this.rendezvousService.cancelRendezvous(id);
}

@Patch(':id/confirm')
confirmRendezvous(@Param('id', ParseIntPipe) id: number) {
  return this.rendezvousService.confirmRendezvous(id);
}
}
