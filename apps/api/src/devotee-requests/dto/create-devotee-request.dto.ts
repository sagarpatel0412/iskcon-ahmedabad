// src/devotee-requests/dto/create-devotee-request.dto.ts

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDevoteeRequestDto {
  @IsInt()
  centre_id!: number;

  @IsOptional()
  @IsString()
  spiritual_name?: string;

  @IsOptional()
  @IsInt()
  current_malas?: number;

  @IsOptional()
  initiation_status?: 'none' | 'harinam' | 'diksha';

  @IsOptional()
  @IsInt()
  years_associated?: number;

  @IsOptional()
  @IsString()
  services?: string;

  @IsOptional()
  @IsString()
  devotee_reference_name?: string;

  @IsOptional()
  @IsString()
  devotee_reference_phone?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}