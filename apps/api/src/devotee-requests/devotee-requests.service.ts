// src/devotee-requests/devotee-requests.service.ts

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { v4 as uuidv4 } from 'uuid';

import { DevoteeRequest } from './devotee-request.model';
import { CreateDevoteeRequestDto } from './dto/create-devotee-request.dto';
import { User } from 'src/users/user.model';
import { Role } from 'src/roles/role.model';
import { UserRole } from 'src/roles/user-role.model';
import { Centre } from 'src/centres/centre.model';
import * as bcrypt from 'bcrypt';
import { RegisterDevoteeDto } from './dto/register-devotee.dto';
import * as crypto from 'crypto';

@Injectable()
export class DevoteeRequestsService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Role)
    private readonly roleModel: typeof Role,

    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,

    @InjectModel(Centre)
    private readonly centreModel: typeof Centre,

    @InjectModel(DevoteeRequest)
    private readonly devoteeRequestModel: typeof DevoteeRequest,
  ) { }

  async createRequest(
    userId: number,
    dto: CreateDevoteeRequestDto,
  ) {
    const existingPending =
      await this.devoteeRequestModel.findOne({
        where: {
          user_id: userId,
          status: 'pending',
        },
      });

    if (existingPending) {
      throw new BadRequestException(
        'You already have a pending devotee request',
      );
    }

    return this.devoteeRequestModel.create({
      uuid: uuidv4(),
      user_id: userId,
      centre_id: dto.centre_id,
      spiritual_name: dto.spiritual_name ?? null,
      current_malas: dto.current_malas ?? 0,
      initiation_status:
        dto.initiation_status ?? 'none',
      years_associated:
        dto.years_associated ?? 0,
      services: dto.services ?? null,
      devotee_reference_name:
        dto.devotee_reference_name ?? null,
      devotee_reference_phone:
        dto.devotee_reference_phone ?? null,
      reason: dto.reason ?? null,
      status: 'pending',
    });
  }

  async registerDevotee(
    dto: RegisterDevoteeDto,
  ) {
    const existingUser =
      await this.userModel.findOne({
        where: {
          email: dto.email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Email already registered',
      );
    }

    const existingPhone =
      dto.phone
        ? await this.userModel.findOne({
          where: {
            phone: dto.phone,
          },
        })
        : null;

    if (existingPhone) {
      throw new BadRequestException(
        'Phone already registered',
      );
    }

    const centre =
      await this.centreModel.findByPk(
        dto.centre_id,
      );

    if (!centre) {
      throw new BadRequestException(
        'Invalid centre selected',
      );
    }

    const devoteeRole =
      await this.roleModel.findOne({
        where: {
          name: 'DEVOTEE',
        },
      });

    if (!devoteeRole) {
      throw new BadRequestException(
        'DEVOTEE role not found',
      );
    }

    const passwordHash =
      await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id,
      first_name: dto.first_name,
      last_name: dto.last_name ?? null,
      email: dto.email,
      phone: dto.phone ?? null,
      password_hash: passwordHash,
    });

    await this.userRoleModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      role_id: devoteeRole.id,
    });

    const devoteeRequest =
      await this.devoteeRequestModel.create({
        uuid: uuidv4(),
        user_id: user.id,
        centre_id: dto.centre_id,
        spiritual_name:
          dto.spiritual_name ?? null,
        current_malas:
          dto.current_malas ?? 0,
        initiation_status:
          dto.initiation_status ?? 'none',
        years_associated:
          dto.years_associated ?? 0,
        services: dto.services ?? null,
        devotee_reference_name:
          dto.devotee_reference_name ?? null,
        devotee_reference_phone:
          dto.devotee_reference_phone ??
          null,
        reason: dto.reason ?? null,
        status: 'pending',
      });

    return {
      message:
        'Devotee registration request submitted successfully',
      user_uuid: user.uuid,
      devotee_request_uuid:
        devoteeRequest.uuid,
      status: 'pending',
    };
  }
}