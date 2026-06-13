import { Module } from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { DailyProgressController } from './daily-progress.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DailyProgress } from './daily-progress.model';
import { AuthToken } from 'src/auth/auth-token.model';
import { ProgressLevel } from './progress-level.model';

@Module({
  imports: [SequelizeModule.forFeature([DailyProgress, ProgressLevel, AuthToken])],
  controllers: [DailyProgressController],
  providers: [DailyProgressService],
  exports: [DailyProgressService],
})
export class DailyProgressModule {}
