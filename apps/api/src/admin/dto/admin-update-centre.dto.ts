import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateCentreDto } from './admin-create-centre.dto';


export class AdminUpdateCentreDto extends PartialType(AdminCreateCentreDto) {}
