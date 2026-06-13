// src/users/dto/update-password.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  old_password!: string;

  @IsNotEmpty()
  @MinLength(6)
  new_password!: string;
}