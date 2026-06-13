import { PartialType } from "@nestjs/mapped-types";
import { CreateDailyProgressDto } from "./create-daily-progress.dto";

export class UpdateDailyProgressDto extends PartialType(
  CreateDailyProgressDto,
) {}