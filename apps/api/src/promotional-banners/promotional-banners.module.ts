import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PromotionalBannersController } from './promotional-banners.controller';
import { PromotionalBannersService } from './promotional-banners.service';
import { PromotionalBanner } from './promotional-banner.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [SequelizeModule.forFeature([PromotionalBanner, AuthToken])],
  controllers: [PromotionalBannersController],
  providers: [PromotionalBannersService],
  exports: [PromotionalBannersService],
})
export class PromotionalBannersModule {}