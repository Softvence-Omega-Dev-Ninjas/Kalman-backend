import { Test, TestingModule } from '@nestjs/testing';
import { TradesmanController } from './tradesman.controller';
import { TradesmanService } from './tradesman.service';

describe('TradesmanController', () => {
  let controller: TradesmanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesmanController],
      providers: [TradesmanService],
    }).compile();

    controller = module.get<TradesmanController>(TradesmanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
