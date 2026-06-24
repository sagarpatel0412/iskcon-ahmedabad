import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { EventPaymentsService } from './event-payments.service';
import { CreateEventPaymentOrderDto } from './dto/create-event-payment-order.dto';
import { VerifyEventPaymentDto } from './dto/verify-event-payment.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('event-payments')
export class EventPaymentsController {
  constructor(private readonly eventPaymentsService: EventPaymentsService) {}

  @UseGuards(AuthTokenGuard)
  @Post('create-order')
  createOrder(@Body() dto: CreateEventPaymentOrderDto, @Req() req: any) {
    return this.eventPaymentsService.createOrder(dto, req.user);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(AuthTokenGuard)
  @Post('verify')
  verifyPayment(@Body() dto: VerifyEventPaymentDto, @Req() req: any) {
    return this.eventPaymentsService.verifyPayment(dto, req.user);
  }
}