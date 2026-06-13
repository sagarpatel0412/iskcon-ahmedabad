import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class VerifyEventPaymentDto {
  @IsNotEmpty()
  @IsString()
  payment_uuid!: string;

  @IsNotEmpty()
  @IsString()
  razorpay_order_id!: string;

  @IsNotEmpty()
  @IsString()
  razorpay_payment_id!: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature!: string;

  @IsOptional()
  @IsObject()
  form_answers?: Record<string, any>;
}