import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { ContactMessage } from './models/contact-message.model';
import { ProblemReport } from './models/problem-report.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ContactMessage,
      ProblemReport,
      AuthToken
    ]),
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}