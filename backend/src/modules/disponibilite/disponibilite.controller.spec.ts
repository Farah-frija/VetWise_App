import { Test, TestingModule } from '@nestjs/testing';
import { DisponibiliteController } from './disponibilite.controller';

describe('DisponibiliteController', () => {
  let controller: DisponibiliteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibiliteController],
    }).compile();

    controller = module.get<DisponibiliteController>(DisponibiliteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
