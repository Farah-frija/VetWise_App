import { PartialType } from '@nestjs/mapped-types';
import { CreateDossierMedicalDto } from './create-dossier-medical.dto';

export class UpdateDossierMedicalDto extends PartialType(CreateDossierMedicalDto) {}
