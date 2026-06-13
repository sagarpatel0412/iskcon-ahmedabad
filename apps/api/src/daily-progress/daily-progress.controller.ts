import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { DailyProgressService } from "./daily-progress.service";
import { CreateDailyProgressDto } from "./dto/create-daily-progress.dto";
import { UpdateDailyProgressDto } from "./dto/update-daily-progress.dto";
import { AuthTokenGuard } from "../auth/guards/auth-token.guard";

@Controller("daily-progress")
@UseGuards(AuthTokenGuard)
export class DailyProgressController {
  constructor(
    private readonly dailyProgressService: DailyProgressService,
  ) {}

  @Post()
  createOrUpdate(@Body() dto: CreateDailyProgressDto, @Req() req: any) {
    return this.dailyProgressService.createOrUpdate(dto, req.user);
  }

  @Get("me")
  findMine(@Req() req: any) {
    return this.dailyProgressService.findMine(req.user);
  }

  @Get("me/today")
  findToday(@Req() req: any) {
    return this.dailyProgressService.findToday(req.user);
  }

  @Get("me/summary")
  summary(@Req() req: any) {
    return this.dailyProgressService.summary(req.user);
  }

  @Patch(":uuid")
  update(
    @Param("uuid") uuid: string,
    @Body() dto: UpdateDailyProgressDto,
    @Req() req: any,
  ) {
    return this.dailyProgressService.update(uuid, dto, req.user);
  }

  @Delete(":uuid")
  remove(@Param("uuid") uuid: string, @Req() req: any) {
    return this.dailyProgressService.remove(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('my-level')
  getMyProgressLevel(@Req() req: any) {
    return this.dailyProgressService.getMyProgressLevel(req.user);
  }

  @Get('levels')
  getLevels() {
    return this.dailyProgressService.getLevels();
  }
}