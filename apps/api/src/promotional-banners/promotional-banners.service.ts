import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { PromotionalBanner } from './promotional-banner.model';
import { User } from '../users/user.model';

@Injectable()
export class PromotionalBannersService {
  constructor(
    @InjectModel(PromotionalBanner)
    private readonly promotionalBannerModel: typeof PromotionalBanner,
  ) {}

  private isAdmin(user: User) {
    return (
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false
    );
  }

  async create(dto: any, user: User) {
    const banner = await this.promotionalBannerModel.create({
      uuid: uuidv4(),
      title: dto.title,
      subtitle: dto.subtitle || null,
      description: dto.description || null,
      image_url: dto.image_url || null,
      button_text: dto.button_text || null,
      redirect_url: dto.redirect_url || null,
      banner_type: dto.banner_type || 'custom',
      reference_uuid: dto.reference_uuid || null,
      display_type: dto.display_type || 'modal',
      position: dto.position || 'all',
      start_at: dto.start_at ? new Date(dto.start_at) : null,
      end_at: dto.end_at ? new Date(dto.end_at) : null,
      auto_remove_at: dto.auto_remove_at ? new Date(dto.auto_remove_at) : null,
      priority: dto.priority ? Number(dto.priority) : 1,
      is_active: dto.is_active ?? true,
      created_by: user.id,
    });

    return {
      message: 'Promotional banner created successfully',
      banner,
    };
  }

  async findAll(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.position && query.position !== 'all') {
      where.position = query.position;
    }

    if (query.banner_type && query.banner_type !== 'all') {
      where.banner_type = query.banner_type;
    }

    if (query.is_active !== undefined) {
      where.is_active = query.is_active === 'true';
    }

    if (query.search?.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query.search}%` } },
        { subtitle: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.promotionalBannerModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password_hash'] },
        },
      ],
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC'],
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findActive(position = 'all') {
    const now = new Date();

    const positionWhere =
      position === 'all'
        ? {}
        : {
            [Op.or]: [{ position }, { position: 'all' }],
          };

    return this.promotionalBannerModel.findOne({
      where: {
        ...positionWhere,
        is_active: true,
        [Op.and]: [
          {
            [Op.or]: [{ start_at: null }, { start_at: { [Op.lte]: now } }],
          },
          {
            [Op.or]: [{ end_at: null }, { end_at: { [Op.gte]: now } }],
          },
        ],
      },
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });
  }

  async findOne(uuid: string) {
    const banner = await this.promotionalBannerModel.findOne({
      where: { uuid },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });

    if (!banner) {
      throw new NotFoundException('Promotional banner not found');
    }

    return banner;
  }

  async update(uuid: string, dto: any, user: User) {
    const banner = await this.findOne(uuid);

    const isCreator = banner.created_by === user.id;

    if (!isCreator && !this.isAdmin(user)) {
      throw new ForbiddenException('You cannot update this banner');
    }

    await banner.update({
      title: dto.title ?? banner.title,
      subtitle: dto.subtitle ?? banner.subtitle,
      description: dto.description ?? banner.description,
      image_url: dto.image_url ?? banner.image_url,
      button_text: dto.button_text ?? banner.button_text,
      redirect_url: dto.redirect_url ?? banner.redirect_url,
      banner_type: dto.banner_type ?? banner.banner_type,
      reference_uuid: dto.reference_uuid ?? banner.reference_uuid,
      display_type: dto.display_type ?? banner.display_type,
      position: dto.position ?? banner.position,
      start_at: dto.start_at ? new Date(dto.start_at) : banner.start_at,
      end_at: dto.end_at ? new Date(dto.end_at) : banner.end_at,
      auto_remove_at: dto.auto_remove_at
        ? new Date(dto.auto_remove_at)
        : banner.auto_remove_at,
      priority:
        dto.priority !== undefined ? Number(dto.priority) : banner.priority,
      is_active: dto.is_active ?? banner.is_active,
    });

    return {
      message: 'Promotional banner updated successfully',
      banner,
    };
  }

  async remove(uuid: string, user: User) {
    const banner = await this.findOne(uuid);

    const isCreator = banner.created_by === user.id;

    if (!isCreator && !this.isAdmin(user)) {
      throw new ForbiddenException('You cannot delete this banner');
    }

    await banner.destroy();

    return {
      message: 'Promotional banner deleted successfully',
    };
  }

  async uploadImage(
    uuid: string,
    file: Express.Multer.File,
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const banner = await this.findOne(uuid);

    const isCreator = banner.created_by === user.id;

    if (!isCreator && !this.isAdmin(user)) {
      throw new ForbiddenException('You cannot upload image for this banner');
    }

    const imageUrl = `/uploads/promotional-banners/${file.filename}`;

    await banner.update({
      image_url: imageUrl,
    });

    return {
      message: 'Banner image uploaded successfully',
      image_url: imageUrl,
      banner,
    };
  }

  @Cron('*/30 * * * *')
  async autoRemoveExpiredBanners() {
    await this.promotionalBannerModel.destroy({
      where: {
        auto_remove_at: {
          [Op.lte]: new Date(),
        },
      },
    });
  }
}