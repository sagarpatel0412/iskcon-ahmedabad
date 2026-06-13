// src/users/users.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from '../roles/user-role.model';
import { Role } from '../roles/role.model';
import { Centre } from '../centres/centre.model';
import { ContentSubscription } from '../content/models/content-subscription.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(ContentSubscription)
    private readonly subscriptionModel: typeof ContentSubscription,
    
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  private removePassword(user: User) {
    const plain = user.get({ plain: true }) as any;
    delete plain.password_hash;
    return plain;
  }

  async me(userId: number) {
    if (!userId) {
      throw new BadRequestException('User id missing');
    }

    const user = await this.userModel.findByPk(userId, {
      include: [
        { model: Centre },
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activeSubscription = await this.subscriptionModel.findOne({
      where: {
        user_id: userId,
        status: 'active',
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
      },
    });

    const userData = this.removePassword(user);

    return {
      ...userData,
      isSubscribed: !!activeSubscription,
      activeSubscription: activeSubscription
        ? {
            uuid: activeSubscription.uuid,
            plan_name: activeSubscription.plan_name,
            plan_type: activeSubscription.plan_type,
            amount: activeSubscription.amount,
            currency: activeSubscription.currency,
            start_date: activeSubscription.start_date,
            end_date: activeSubscription.end_date,
            status: activeSubscription.status,
          }
        : null,
    };
  }

  async updateMe(userId: number, dto: UpdateUserDto) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.phone && dto.phone !== user.phone) {
      const phoneExists = await User.findOne({
        where: {
          phone: dto.phone,
          id: {
            [Op.ne]: userId,
          },
        },
      });

      if (phoneExists) {
        throw new BadRequestException('Phone already used');
      }
    }

    const allowedUpdates = {
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      gender: dto.gender,
      country_code: dto.country_code,
      state_code: dto.state_code,
      city: dto.city,
      address_line_1: dto.address_line_1,
      address_line_2: dto.address_line_2,
      landmark: dto.landmark,
      postal_code: dto.postal_code,
      profile_image_url: dto.profile_image_url,
    };

    await user.update(allowedUpdates);

    return {
      message: 'Profile updated successfully',
      user: this.removePassword(user),
    };
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.old_password, user.password_hash);

    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.new_password, 10);

    await user.update({
      password_hash: newHash,
    });

    return {
      message: 'Password updated successfully',
    };
  }

  async findAll() {
    const users = await this.userModel.findAll({
      include: [
        { model: Centre },
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
      order: [['id', 'DESC']],
    });

    return users.map((user) => this.removePassword(user));
  }

  async findOne(uuid: string) {
    const user = await this.userModel.findOne({
      where: { uuid },
      include: [
        { model: Centre },
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.removePassword(user);
  }
}