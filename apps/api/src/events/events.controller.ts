import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VerifiedDevoteeGuard } from '../auth/guards/verified-devotee.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEventFormFieldDto } from './dto/create-event-form-field.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { ScanEventQrDto } from './dto/scan-event-qr.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post()
  create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(dto, req.user);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '9',
    @Query('search') search = '',
    @Query('status') status = 'all',
  ) {
    return this.eventsService.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      status,
    });
  }

  @UseGuards(AuthTokenGuard)
  @Get('my-registrations')
  myRegistrations(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.eventsService.myRegistrations(req.user, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('my-events')
  myEvents(@Req() req: any) {
    return this.eventsService.myEvents(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('scan-qr')
  scanQr(@Body() dto: ScanEventQrDto, @Req() req: any) {
    return this.eventsService.scanQr(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('form-fields/:fieldUuid')
  updateFormField(
    @Param('fieldUuid') fieldUuid: string,
    @Body() dto: CreateEventFormFieldDto,
    @Req() req: any,
  ) {
    return this.eventsService.updateFormField(fieldUuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('form-fields/:fieldUuid')
  deleteFormField(@Param('fieldUuid') fieldUuid: string, @Req() req: any) {
    return this.eventsService.deleteFormField(fieldUuid, req.user);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.eventsService.findOne(uuid);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateEventDto, @Req() req: any) {
    return this.eventsService.update(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @Req() req: any) {
    return this.eventsService.remove(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/form-fields')
  addFormField(
    @Param('uuid') uuid: string,
    @Body() dto: CreateEventFormFieldDto,
    @Req() req: any,
  ) {
    return this.eventsService.addFormField(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/form-fields/bulk')
  addFormFieldsBulk(
    @Param('uuid') uuid: string,
    @Body() body: { fields: CreateEventFormFieldDto[] },
    @Req() req: any,
  ) {
    return this.eventsService.addFormFieldsBulk(uuid, body.fields, req.user);
  }

  @Get(':uuid/form-fields')
  getFormFields(@Param('uuid') uuid: string) {
    return this.eventsService.getFormFields(uuid);
  }

  @UseGuards(AuthTokenGuard)
  @Post(':uuid/register')
  registerForEvent(
    @Param('uuid') uuid: string,
    @Body() dto: RegisterEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.registerForEvent(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get(':uuid/registrations')
  eventRegistrations(@Param('uuid') uuid: string, @Req() req: any) {
    return this.eventsService.eventRegistrations(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/poster')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/events',
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
  uploadPoster(
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.eventsService.uploadPoster(uuid, file, req.user);
  }
}