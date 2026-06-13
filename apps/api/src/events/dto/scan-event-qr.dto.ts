import { IsNotEmpty, IsString } from 'class-validator';

export class ScanEventQrDto {
  @IsString()
  @IsNotEmpty()
  qr_token!: string;
}