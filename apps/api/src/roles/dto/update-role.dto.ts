// src/roles/dto/update-role.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}