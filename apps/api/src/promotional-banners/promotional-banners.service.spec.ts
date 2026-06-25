import { Test, TestingModule } from '@nestjs/testing';
import { PromotionalBannersService } from './promotional-banners.service';

describe('PromotionalBannersService', () => {
  let service: PromotionalBannersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionalBannersService],
    }).compile();

    service = module.get<PromotionalBannersService>(PromotionalBannersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
