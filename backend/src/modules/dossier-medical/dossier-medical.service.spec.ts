import { Test, TestingModule } from '@nestjs/testing';
import { DossierMedicalService } from './dossier-medical.service';

describe('DossierMedicalService', () => {
  let service: DossierMedicalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DossierMedicalService],
    }).compile();

    service = module.get<DossierMedicalService>(DossierMedicalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
