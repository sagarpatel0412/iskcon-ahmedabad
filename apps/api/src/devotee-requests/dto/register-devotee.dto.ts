// src/devotee-requests/dto/register-devotee.dto.ts

import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDevoteeDto {
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsInt()
  centre_id!: number;

  @IsOptional()
  @IsString()
  spiritual_name?: string;

  @IsOptional()
  current_malas?: number;

  @IsOptional()
  initiation_status?: 'none' | 'harinam' | 'diksha';

  @IsOptional()
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