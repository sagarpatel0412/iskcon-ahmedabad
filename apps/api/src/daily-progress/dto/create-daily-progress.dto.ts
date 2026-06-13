import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateDailyProgressDto {
  @IsDateString()
  progress_date!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  mala_count?: number;

  @IsOptional()
  @IsBoolean()
  lecture_attended?: boolean;

  @IsOptional()
  @IsString()
  lecture_title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  books_read_count?: number;

  @IsOptional()
  @IsString()
  current_book?: string;

  @IsOptional()
  @IsIn(["not_started", "ongoing", "completed"])
  book_status?: "not_started" | "ongoing" | "completed";

  @IsOptional()
  @IsString()
  notes?: string;
}