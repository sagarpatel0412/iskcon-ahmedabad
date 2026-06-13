import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SupportService } from './support.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { CreateProblemReportDto } from './dto/create-problem-report.dto';

import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('contact')
  createContactMessage(@Body() dto: CreateContactMessageDto) {
    return this.supportService.createContactMessage(dto);
  }

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