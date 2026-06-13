import { IsOptional } from 'class-validator';

export class RegisterEventDto {
  @IsOptional()
  form_answers?: Record<string, any>;
}