// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  device_type?: 'android' | 'ios' | 'web';

  @IsOptional()
  @IsString()
  device_name?: string;
}