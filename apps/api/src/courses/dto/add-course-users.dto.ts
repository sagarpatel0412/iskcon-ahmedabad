import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddCourseUsersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  user_ids!: number[];

  @IsOptional()
  @IsEnum(['added_by_creator', 'admin_added'])
  registration_source?: 'added_by_creator' | 'admin_added';

  @IsOptional()
  @IsString()
  notes?: string;
}