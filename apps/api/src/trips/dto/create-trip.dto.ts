import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TripPlaceDto {
  @IsString()
  place_name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  visit_time?: string;

  @IsOptional()
  @IsString()
  location_url?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  sort_order?: number;
}

class TripDayDto {
  @IsInt()
  @Min(1)
  day_number!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  breakfast_info?: string;

  @IsOptional()
  @IsString()
  lunch_info?: string;

  @IsOptional()
  @IsString()
  dinner_info?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripPlaceDto)
  places?: TripPlaceDto[];
}

class TripStayDto {
  @IsString()
  stay_name!: string;

  @IsOptional()
  @IsEnum(['ashram', 'hotel', 'guest_house', 'dharamshala', 'other'])
  stay_type?: 'ashram' | 'hotel' | 'guest_house' | 'dharamshala' | 'other';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  check_in_date?: string;

  @IsOptional()
  @IsDateString()
  check_out_date?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  location_url?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateTripDto {
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

  @IsDateString()
  start_date!: string;

  @IsDateString()
  end_date!: string;

  @IsOptional()
  @IsString()
  departure_city?: string;

  @IsString()
  destination!: string;

  @IsOptional()
  @IsString()
  meeting_point?: string;

  @IsOptional()
  @IsString()
  meeting_time?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_capacity?: number;

  @IsOptional()
  @IsDateString()
  registration_start_date?: string;

  @IsOptional()
  @IsDateString()
  registration_end_date?: string;

  @IsOptional()
  @IsString()
  includes?: string;

  @IsOptional()
  @IsString()
  excludes?: string;

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
  @Type(() => TripDayDto)
  days?: TripDayDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TripStayDto)
  stays?: TripStayDto[];
}