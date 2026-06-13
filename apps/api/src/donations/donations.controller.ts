import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';

import type { Response } from 'express';

import { DonationsService } from './donations.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @UseGuards(AuthTokenGuard)
  @Post('create-order')
  createOrder(@Body() dto: CreateDonationOrderDto, @Req() req: any) {
    return this.donationsService.createOrder(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('verify')
  verifyPayment(@Body() dto: VerifyDonationPaymentDto, @Req() req: any) {
    return this.donationsService.verifyPayment(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('my-donations')
  myDonations(@Req() req: any) {
    return this.donationsService.myDonations(req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('receipt/:donationUuid')
  async downloadReceipt(
    @Param('donationUuid') donationUuid: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const filePath = await this.donationsService.getReceiptPath(
      donationUuid,
      req.user,
    );

    if (!filePath) {
      throw new NotFoundException('Receipt not found');
    }

    return res.download(filePath);
  }
}