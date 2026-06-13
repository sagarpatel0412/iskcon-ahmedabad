import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Centre } from './centre.model';
import { CreateCentreDto } from './dto/create-centre.dto';
import { UpdateCentreDto } from './dto/update-centre.dto';

@Injectable()
export class CentresService {
  constructor(
    @InjectModel(Centre)
    private readonly centreModel: typeof Centre,
  ) {}

  async create(createCentreDto: CreateCentreDto) {
    return this.centreModel.create(createCentreDto as any);
  }

  async findAll() {
    return this.centreModel.findAll({
      where: {
        is_active: true,
      },
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number) {
    const centre = await this.centreModel.findByPk(id);

    if (!centre) {
      throw new NotFoundException('Centre not found');
    }

    return centre;
  }

  async update(
    id: number,
    updateCentreDto: UpdateCentreDto,
  ) {
    const centre = await this.findOne(id);

    await centre.update(updateCentreDto);

    return centre;
  }

  async remove(id: number) {
    const centre = await this.findOne(id);

    await centre.destroy();

    return {
      message: 'Centre deleted successfully',
    };
  }
}