import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findPublishedCourses() {
    return this.coursesService.findPublishedCourses();
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
}