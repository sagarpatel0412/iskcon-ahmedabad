import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EnrollCourseDto {
  @IsString()
  full_name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}