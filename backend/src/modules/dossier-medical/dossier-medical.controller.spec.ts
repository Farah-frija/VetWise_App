import { Test, TestingModule } from '@nestjs/testing';
import { DossierMedicalController } from './dossier-medical.controller';
import { DossierMedicalService } from './dossier-medical.service';

describe('DossierMedicalController', () => {
  let controller: DossierMedicalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DossierMedicalController],
      providers: [DossierMedicalService],
    }).compile();

    controller = module.get<DossierMedicalController>(DossierMedicalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
