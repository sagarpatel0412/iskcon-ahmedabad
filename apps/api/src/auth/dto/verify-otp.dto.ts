// src/auth/dto/verify-otp.dto.ts
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsIn([
    'register',
    'login',
    'forgot_password',
    'verify_email',
    'verify_phone',
  ])
  purpose!:
    | 'register'
    | 'login'
    | 'forgot_password'
    | 'verify_email'
    | 'verify_phone';

  @IsOptional()
  @IsEnum(['android', 'ios', 'web'])
  device_type?: 'android' | 'ios' | 'web';

  @IsOptional()
  @IsString()
  device_name?: string;
}
