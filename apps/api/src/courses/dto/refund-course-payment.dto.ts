import { IsOptional, IsString } from 'class-validator';

export class RefundCoursePaymentDto {
  @IsOptional()
  @IsString()
  reason?: string;
}