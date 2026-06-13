import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDonationOrderDto {
  @IsEnum(['nitya_seva', 'gau_seva', 'khichdi_seva'])
  seva_type!: 'nitya_seva' | 'gau_seva' | 'khichdi_seva';

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  donor_name?: string;

  @IsOptional()
  @IsEmail()
  donor_email?: string;

  @IsOptional()
  @IsString()
  donor_phone?: string;

  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}