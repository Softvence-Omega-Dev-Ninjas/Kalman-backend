import { Test, TestingModule } from '@nestjs/testing';
import { TradesmanService } from './tradesman.service';

describe('TradesmanService', () => {
  let service: TradesmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradesmanService],
    }).compile();

    service = module.get<TradesmanService>(TradesmanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
