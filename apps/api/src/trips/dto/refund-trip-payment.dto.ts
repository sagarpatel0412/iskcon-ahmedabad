import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class RefundTripPaymentDto {
  @IsNotEmpty()
  @IsString()
  payment_uuid!: string;

  @IsOptional()
  @IsNumber()
  refund_amount?: number;

  @IsOptional()
  @IsString()
  refund_reason?: string;
}