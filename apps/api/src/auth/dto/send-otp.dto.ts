// src/auth/dto/send-otp.dto.ts
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class SendOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsIn(['register', 'login', 'forgot_password', 'verify_email', 'verify_phone'])
  purpose!: 'register' | 'login' | 'forgot_password' | 'verify_email' | 'verify_phone';
}