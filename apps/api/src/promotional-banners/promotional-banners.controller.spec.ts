import { Test, TestingModule } from '@nestjs/testing';
import { PromotionalBannersController } from './promotional-banners.controller';
import { PromotionalBannersService } from './promotional-banners.service';

describe('PromotionalBannersController', () => {
  let controller: PromotionalBannersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionalBannersController],
      providers: [PromotionalBannersService],
    }).compile();

    controller = module.get<PromotionalBannersController>(PromotionalBannersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
