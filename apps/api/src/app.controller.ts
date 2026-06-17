import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('festival-calendar')
  getFestivalCalendar(
    @Query('year') year = '2026',
    @Query('city') city = 'Ahmedabad',
    @Query('country') country = 'India',
  ) {
    return this.appService.generateCalendar({
      year,
      city,
      country,
    });
  }

  @Get('krishna-images')
  async getImages(@Req() req: Request) {
    return await this.appService.getImages(req);
  }

  @Get('krishna-images/recommended')
  getRecommended(@Req() req: Request) {
    return this.appService.getRecommendedImages(req);
  }
}
