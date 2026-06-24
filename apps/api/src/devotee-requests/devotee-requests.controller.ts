import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevoteeRequestsService } from './devotee-requests.service';
import { CreateDevoteeRequestDto } from './dto/create-devotee-request.dto';
import { UpdateDevoteeRequestDto } from './dto/update-devotee-request.dto';
import { RegisterDevoteeDto } from './dto/register-devotee.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('devotee-requests')
export class DevoteeRequestsController {
  constructor(private readonly devoteeRequestsService: DevoteeRequestsService) {}

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('register')
    register(@Body() dto: RegisterDevoteeDto) {
      return this.devoteeRequestsService.registerDevotee(dto);
    }
}
