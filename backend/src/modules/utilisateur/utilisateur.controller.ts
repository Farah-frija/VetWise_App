import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { ApiTags } from '@nestjs/swagger';

ApiTags('utilisateurs');
@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Get('veterinaires')
  async getAllVets() {
    const vets = await this.utilisateurService.getAllVets();
    if (!vets || vets.length === 0) {
      throw new NotFoundException('No veterinarians found');
    }
    return vets;
  }
}
