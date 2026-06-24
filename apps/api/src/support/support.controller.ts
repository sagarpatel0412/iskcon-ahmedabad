import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SupportService } from './support.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { CreateProblemReportDto } from './dto/create-problem-report.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('contact')
  createContactMessage(@Body() dto: CreateContactMessageDto) {
    return this.supportService.createContactMessage(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('report-problem')
  createProblemReport(@Body() dto: CreateProblemReportDto) {
    return this.supportService.createProblemReport(dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('contact-messages')
  findContactMessages() {
    return this.supportService.findContactMessages();
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('problem-reports')
  findProblemReports() {
    return this.supportService.findProblemReports();
  }
}