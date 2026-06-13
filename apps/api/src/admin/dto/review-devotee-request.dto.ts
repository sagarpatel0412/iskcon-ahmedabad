import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewDevoteeRequestDto {
  @IsEnum(['approved', 'rejected'])
  status!: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  reason?: string;
}