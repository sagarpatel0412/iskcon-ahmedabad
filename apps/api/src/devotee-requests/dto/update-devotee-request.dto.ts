import { PartialType } from '@nestjs/mapped-types';
import { CreateDevoteeRequestDto } from './create-devotee-request.dto';

export class UpdateDevoteeRequestDto extends PartialType(CreateDevoteeRequestDto) {}
