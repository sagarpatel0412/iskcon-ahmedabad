import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { ReviewDevoteeRequestDto } from './dto/review-devotee-request.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RefundCoursePaymentDto } from 'src/courses/dto/refund-course-payment.dto';
import { AdminCreateCentreDto } from './dto/admin-create-centre.dto';
import { AdminUpdateCentreDto } from './dto/admin-update-centre.dto';

@Controller('meta-idx')
@UseGuards(AuthTokenGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  users(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('verified') verified?: string,
  ) {
    return this.adminService.users({
      search,
      status,
      verified,
    });
  }

  @Get('users/:uuid')
  userDetails(@Param('uuid') uuid: string) {
    return this.adminService.userDetails(uuid);
  }

  @Patch('users/:uuid/verify-devotee')
  verifyDevotee(@Param('uuid') uuid: string) {
    return this.adminService.setDevoteeVerification(uuid, true);
  }

  @Patch('users/:uuid/unverify-devotee')
  unverifyDevotee(@Param('uuid') uuid: string) {
    return this.adminService.setDevoteeVerification(uuid, false);
  }

  @Patch('users/:uuid/activate')
  activateUser(@Param('uuid') uuid: string) {
    return this.adminService.setUserActiveStatus(uuid, true);
  }

  @Patch('users/:uuid/deactivate')
  deactivateUser(@Param('uuid') uuid: string) {
    return this.adminService.setUserActiveStatus(uuid, false);
  }

  @Get('devotee-requests')
  devoteeRequests(@Query('status') status?: string) {
    return this.adminService.devoteeRequests(status);
  }

  @Get('devotee-requests/:uuid')
  devoteeRequestDetails(@Param('uuid') uuid: string) {
    return this.adminService.devoteeRequestDetails(uuid);
  }

  @Patch('devotee-requests/:uuid/review')
  reviewDevoteeRequest(
    @Param('uuid') uuid: string,
    @Body() dto: ReviewDevoteeRequestDto,
    @Req() req: any,
  ) {
    return this.adminService.reviewDevoteeRequest(uuid, dto, req.user);
  }

  // EVENTS
  @Get('events')
  adminEvents() {
    return this.adminService.adminEvents();
  }

  // TRIPS
  @Get('trips')
  adminTrips() {
    return this.adminService.adminTrips();
  }

  // @Post('trips/payments/:paymentUuid/refund')
  // refundTripPayment(@Param('paymentUuid') paymentUuid: string, @Body() dto: any) {
  //   return this.adminService.refundTripPayment(paymentUuid, dto);
  // }

  // COURSES
  @Get('courses')
  adminCourses() {
    return this.adminService.adminCourses();
  }

  @Post('courses/payments/:paymentUuid/refund')
  refundCoursePayment(
    @Param('paymentUuid') paymentUuid: string,
    @Body() dto: any,
  ) {
    return this.adminService.refundCoursePayment(paymentUuid, dto);
  }

  // CONTENT
  @Get('content')
  adminContent() {
    return this.adminService.adminContent();
  }

  // PAYMENTS
  @Get('payments/content')
  adminContentPayments() {
    return this.adminService.adminContentPayments();
  }

  @Get('payments/trips')
  adminTripPayments() {
    return this.adminService.adminTripPayments();
  }

  @Get('payments/courses')
  adminCoursePayments() {
    return this.adminService.adminCoursePayments();
  }

  @Post('payments/content/:paymentUuid/refund')
  refundContentPayment(
    @Param('paymentUuid') paymentUuid: string,
    @Body() dto: RefundCoursePaymentDto,
    @Req() req: any,
  ) {
    return this.adminService.refundContentPayment(paymentUuid, dto, req.user);
  }

  // SUBSCRIPTIONS
  @Get('subscriptions')
  adminSubscriptions() {
    return this.adminService.adminSubscriptions();
  }

  // DONATIONS
  @Get('donations')
  adminDonations() {
    return this.adminService.adminDonations();
  }

  @Patch('users/:uuid')
  updateUser(@Param('uuid') uuid: string, @Body() dto: any) {
    return this.adminService.updateUser(uuid, dto);
  }

  @Patch('events/:uuid/status')
  updateEventStatus(
    @Param('uuid') uuid: string,
    @Body() dto: { status: 'draft' | 'published' | 'cancelled' | 'completed' },
  ) {
    return this.adminService.updateEventStatus(uuid, dto.status);
  }

  @Delete('events/:uuid')
  deleteEvent(@Param('uuid') uuid: string) {
    return this.adminService.deleteEvent(uuid);
  }

  @Patch('trips/:uuid/status')
  updateTripStatus(
    @Param('uuid') uuid: string,
    @Body() dto: { status: string },
  ) {
    return this.adminService.updateTripStatus(uuid, dto.status);
  }

  @Delete('trips/:uuid')
  deleteTrip(@Param('uuid') uuid: string) {
    return this.adminService.deleteTrip(uuid);
  }

  @Post('centres')
  create(
    @Body()
    createCentreDto: AdminCreateCentreDto,
  ) {
    return this.adminService.createAdminCentre(createCentreDto);
  }

  @Patch('centres/:id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateCentreDto: AdminUpdateCentreDto,
  ) {
    return this.adminService.updateAdminCentre(Number(id), updateCentreDto);
  }

  @Delete('centres/:id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.adminService.removeAdminCentre(Number(id));
  }
}
