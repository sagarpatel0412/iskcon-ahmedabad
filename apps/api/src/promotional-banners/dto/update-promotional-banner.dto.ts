import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionalBannerDto } from './create-promotional-banner.dto';

export class UpdatePromotionalBannerDto extends PartialType(CreatePromotionalBannerDto) {}
