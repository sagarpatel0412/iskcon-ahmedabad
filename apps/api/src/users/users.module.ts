// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRole } from '../roles/user-role.model';
import { Role } from '../roles/role.model';
import { Centre } from '../centres/centre.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthToken } from 'src/auth/auth-token.model';
import { ContentSubscription } from 'src/content/models/content-subscription.model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRole, Role, Centre, AuthToken, ContentSubscription]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}