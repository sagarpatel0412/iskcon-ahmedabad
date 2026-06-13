import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CourseSessionDto {
  @IsInt()
  @Min(1)
  session_number!: number;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  session_date!: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsString()
  venue_name?: string;

  @IsOptional()
  @IsString()
  venue_address?: string;

  @IsOptional()
  @IsString()
  online_meeting_url?: string;
}

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsInt()
  centre_id?: number;

  @IsOptional()
  @IsEnum(['offline', 'online', 'hybrid'])
  course_mode?: 'offline' | 'online' | 'hybrid';

  @IsOptional()
  @IsString()
  venue_name?: string;

  @IsOptional()
  @IsString()
  venue_address?: string;

  @IsOptional()
  @IsString()
  online_meeting_url?: string;

  @IsDateString()
  start_date!: string;

  @IsDateString()
  end_date!: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_capacity?: number;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  registration_start_date?: string;

  @IsOptional()
  @IsDateString()
  registration_end_date?: string;

  @IsOptional()
  @IsString()
  what_you_will_learn?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsString()
  contact_name?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'cancelled', 'completed'])
  status?: 'draft' | 'published' | 'cancelled' | 'completed';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseSessionDto)
  sessions?: CourseSessionDto[];
}