import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('countries')
  getCountries() {
    return this.locationService.getCountries();
  }

  @Get('states/:countryCode')
  getStates(@Param('countryCode') countryCode: string) {
    return this.locationService.getStates(countryCode);
  }

  @Get('cities/:countryCode/:stateCode')
  getCities(
    @Param('countryCode') countryCode: string,
    @Param('stateCode') stateCode: string,
  ) {
    return this.locationService.getCities(countryCode, stateCode);
  }
}