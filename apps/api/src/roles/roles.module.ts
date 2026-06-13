// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { UserRole } from './user-role.model';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [SequelizeModule.forFeature([Role, UserRole])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}