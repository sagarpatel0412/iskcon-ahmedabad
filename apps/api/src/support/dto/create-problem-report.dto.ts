import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProblemReportDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum([
    'login_issue',
    'payment_issue',
    'event_issue',
    'content_issue',
    'app_bug',
    'other',
  ])
  problem_type?:
    | 'login_issue'
    | 'payment_issue'
    | 'event_issue'
    | 'content_issue'
    | 'app_bug'
    | 'other';

  @IsOptional()
  @IsString()
  page_url?: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}