import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PromotionalBannersService } from './promotional-banners.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VerifiedDevoteeGuard } from '../auth/guards/verified-devotee.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('promotional-banners')
export class PromotionalBannersController {
  constructor(
    private readonly promotionalBannersService: PromotionalBannersService,
  ) {}

  @Get('active')
  findActive(@Query('position') position = 'all') {
    return this.promotionalBannersService.findActive(position);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.promotionalBannersService.create(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get()
  findAll(@Query() query: any) {
    return this.promotionalBannersService.findAll(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.promotionalBannersService.findOne(uuid);
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.promotionalBannersService.update(uuid, dto, req.user);
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @Req() req: any) {
    return this.promotionalBannersService.remove(uuid, req.user);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/promotional-banners',
        filename: (_req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.promotionalBannersService.uploadImage(uuid, file, req.user);
  }
}