import { Test, TestingModule } from '@nestjs/testing';
import { DevoteeRequestsController } from './devotee-requests.controller';
import { DevoteeRequestsService } from './devotee-requests.service';

describe('DevoteeRequestsController', () => {
  let controller: DevoteeRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevoteeRequestsController],
      providers: [DevoteeRequestsService],
    }).compile();

    controller = module.get<DevoteeRequestsController>(DevoteeRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
