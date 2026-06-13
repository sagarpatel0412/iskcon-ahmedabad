// src/roles/roles.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RolesService {
  constructor(
     @InjectModel(Role)
      private readonly roleModel: typeof Role,
  ) {}

  async create(dto: CreateRoleDto) {
    const exists = await this.roleModel.findOne({ where: { name: dto.name } });

    if (exists) {
      throw new BadRequestException('Role already exists');
    }

    return this.roleModel.create({
      uuid: uuidv4(),
      name: dto.name,
      description: dto.description || null,
    });
  }

  async findAll() {
    return this.roleModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async findOne(uuid: string) {
    const role = await this.roleModel.findOne({ where: { uuid } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(uuid: string, dto: UpdateRoleDto) {
    const role = await this.findOne(uuid);

    if (dto.name && dto.name !== role.name) {
      const exists = await this.roleModel.findOne({ where: { name: dto.name } });

      if (exists) {
        throw new BadRequestException('Role name already exists');
      }
    }

    await role.update(dto);
    return role;
  }

  async remove(uuid: string) {
    const role = await this.findOne(uuid);
    await role.destroy();

    return {
      message: 'Role deleted successfully',
    };
  }
}