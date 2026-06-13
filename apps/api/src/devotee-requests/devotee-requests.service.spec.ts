import { Test, TestingModule } from '@nestjs/testing';
import { DevoteeRequestsService } from './devotee-requests.service';

describe('DevoteeRequestsService', () => {
  let service: DevoteeRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevoteeRequestsService],
    }).compile();

    service = module.get<DevoteeRequestsService>(DevoteeRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
