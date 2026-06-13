import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNumber()
  centre_id!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  poster_url?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  event_date!: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsDateString()
  registration_start_at?: string;

  @IsOptional()
  @IsDateString()
  registration_end_at?: string;

  @IsOptional()
  @IsNumber()
  max_capacity?: number;

  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;

  @IsOptional()
  @IsNumber()
  price_amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}