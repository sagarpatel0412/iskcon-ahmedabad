import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

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
}
