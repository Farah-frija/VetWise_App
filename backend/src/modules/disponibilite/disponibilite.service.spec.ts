import { Test, TestingModule } from '@nestjs/testing';
import { DisponibiliteService } from './disponibilite.service';

describe('DisponibiliteService', () => {
  let service: DisponibiliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisponibiliteService],
    }).compile();

    service = module.get<DisponibiliteService>(DisponibiliteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
