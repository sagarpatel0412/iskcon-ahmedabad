import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventPaymentOrderDto {
  @IsNotEmpty()
  @IsString()
  event_uuid!: string;
}