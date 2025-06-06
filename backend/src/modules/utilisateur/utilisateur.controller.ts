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

ApiTags('utilisateurs') 
@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}
}
