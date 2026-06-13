import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventFormFieldDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  field_key!: string;

  @IsIn([
    'text',
    'number',
    'email',
    'phone',
    'select',
    'checkbox',
    'textarea',
    'date',
  ])
  field_type!:
    | 'text'
    | 'number'
    | 'email'
    | 'phone'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'date';

  @IsOptional()
  options?: any;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @IsOptional()
  @IsNumber()
  sort_order?: number;
}