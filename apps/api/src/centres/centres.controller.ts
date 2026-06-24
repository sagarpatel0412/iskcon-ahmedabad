import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CentresService } from './centres.service';
import { CreateCentreDto } from './dto/create-centre.dto';
import { UpdateCentreDto } from './dto/update-centre.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('centres')
export class CentresController {
  constructor(
    private readonly centresService: CentresService,
  ) {}

  // @Post()
  // create(
  //   @Body()
  //   createCentreDto: CreateCentreDto,
  // ) {
  //   return this.centresService.create(createCentreDto);
  // }

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @Get()
  findAll() {
    return this.centresService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.centresService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateCentreDto: UpdateCentreDto,
  ) {
    return this.centresService.update(
      Number(id),
      updateCentreDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.centresService.remove(Number(id));
  }
}