import { Module } from '@nestjs/common';
import { DevoteeRequestsService } from './devotee-requests.service';
import { DevoteeRequestsController } from './devotee-requests.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevoteeRequest } from './devotee-request.model';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../roles/user-role.model';
import { Centre } from '../centres/centre.model';



@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRole,
      Centre,
      DevoteeRequest,
    ]),
  ],
  controllers: [DevoteeRequestsController],
  providers: [DevoteeRequestsService],
})
export class DevoteeRequestsModule {}