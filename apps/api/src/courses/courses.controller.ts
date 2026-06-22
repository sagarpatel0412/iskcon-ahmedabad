import {
  BadRequestException,
  Body,
  Controller,
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

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { AddCourseUsersDto } from './dto/add-course-users.dto';
import { VerifyCoursePaymentDto } from './dto/verify-course-payment.dto';
import { RefundCoursePaymentDto } from './dto/refund-course-payment.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findPublishedCourses(
    @Query('page') page = '1',
    @Query('limit') limit = '9',
    @Query('search') search = '',
  ) {
    return this.coursesService.findPublishedCourses({
      page: Number(page),
      limit: Number(limit),
      search,
    });
  }

  @Get(':uuid')
  findCourse(@Param('uuid') uuid: string) {
    return this.coursesService.findCourse(uuid);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post()
  createCourse(@Body() dto: CreateCourseDto, @Req() req: any) {
    return this.coursesService.createCourse(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch(':uuid')
  updateCourse(
    @Param('uuid') uuid: string,
    @Body() dto: CreateCourseDto,
    @Req() req: any,
  ) {
    return this.coursesService.updateCourse(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post(':uuid/register')
  enrollCourse(
    @Param('uuid') uuid: string,
    @Body() dto: EnrollCourseDto,
    @Req() req: any,
  ) {
    return this.coursesService.enrollCourse(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/add-users')
  addUsersToCourse(
    @Param('uuid') uuid: string,
    @Body() dto: AddCourseUsersDto,
    @Req() req: any,
  ) {
    return this.coursesService.addUsersToCourse(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('verify-payment')
  verifyPayment(@Body() dto: VerifyCoursePaymentDto, @Req() req: any) {
    return this.coursesService.verifyCoursePayment(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('me/registered')
  myRegisteredCourses(@Req() req: any) {
    return this.coursesService.myRegisteredCourses(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('me/created')
  myCreatedCourses(@Req() req: any) {
    return this.coursesService.myCreatedCourses(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get(':uuid/registrations')
  courseRegistrations(@Param('uuid') uuid: string, @Req() req: any) {
    return this.coursesService.courseRegistrations(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('payments/:paymentUuid/refund')
  refundPayment(
    @Param('paymentUuid') paymentUuid: string,
    @Body() dto: RefundCoursePaymentDto,
  ) {
    return this.coursesService.refundPayment(paymentUuid, dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post(':uuid/cover-image')
  @UseInterceptors(
    FileInterceptor('cover_image', {
      storage: diskStorage({
        destination: './uploads/courses',
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
  uploadCoverImage(
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.coursesService.uploadCoverImage(uuid, file, req.user);
  }
}