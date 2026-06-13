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

import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { RegisterTripDto } from './dto/register-trip.dto';
import { VerifyTripPaymentDto } from './dto/verify-trip-payment.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RefundTripPaymentDto } from './dto/refund-trip-payment.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  findPublishedTrips() {
    return this.tripsService.findPublishedTrips();
  }

  @Get(':uuid')
  findTrip(@Param('uuid') uuid: string) {
    return this.tripsService.findTrip(uuid);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post()
  createTrip(@Body() dto: CreateTripDto, @Req() req: any) {
    return this.tripsService.createTrip(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post(':uuid/register')
  registerTrip(
    @Param('uuid') uuid: string,
    @Body() dto: RegisterTripDto,
    @Req() req: any,
  ) {
    return this.tripsService.registerTrip(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('verify-payment')
  verifyPayment(@Body() dto: VerifyTripPaymentDto, @Req() req: any) {
    return this.tripsService.verifyTripPayment(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('me/registrations')
  myRegistrations(@Req() req: any) {
    return this.tripsService.myRegistrations(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get(':uuid/registrations')
  tripRegistrations(@Param('uuid') uuid: string, @Req() req: any) {
    return this.tripsService.tripRegistrations(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('me/created')
  myCreatedTrips(@Req() req: any) {
    return this.tripsService.myCreatedTrips(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch(':uuid')
  updateTrip(
    @Param('uuid') uuid: string,
    @Body() dto: CreateTripDto,
    @Req() req: any,
  ) {
    return this.tripsService.updateTrip(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('payments/:paymentUuid')
  paymentDetails(
    @Param('paymentUuid') paymentUuid: string,
    @Req() req: any,
  ) {
    return this.tripsService.paymentDetails(paymentUuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('registrations/:uuid/cancel')
  cancelRegistration(
    @Param('uuid') uuid: string,
    @Req() req: any,
  ) {
    return this.tripsService.cancelRegistration(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('refund/request')
  requestRefund(
    @Body() dto: RefundTripPaymentDto,
    @Req() req: any,
  ) {
    return this.tripsService.requestRefund(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('refund/process')
  processRefund(
    @Body() dto: RefundTripPaymentDto,
    @Req() req: any,
  ) {
    return this.tripsService.processRefund(dto, req.user);
  }

  @Post('webhook/razorpay')
  razorpayWebhook(@Body() body: any, @Req() req: any) {
    return this.tripsService.razorpayWebhook(body, req);
  }
}
