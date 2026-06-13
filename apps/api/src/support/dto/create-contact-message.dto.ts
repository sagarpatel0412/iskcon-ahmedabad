import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactMessageDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsString()
  message!: string;
}