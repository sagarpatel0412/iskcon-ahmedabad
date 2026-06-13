// src/auth/dto/verify-otp.dto.ts
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;

  @IsIn(['register', 'login', 'forgot_password', 'verify_email', 'verify_phone'])
  purpose!: 'register' | 'login' | 'forgot_password' | 'verify_email' | 'verify_phone';
}