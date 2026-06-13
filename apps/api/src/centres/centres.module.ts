import { Module } from '@nestjs/common';
import { CentresService } from './centres.service';
import { CentresController } from './centres.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Centre } from './centre.model';

@Module({
  imports:[SequelizeModule.forFeature([Centre])],
  controllers: [CentresController],
  providers: [CentresService],
})
export class CentresModule {}
