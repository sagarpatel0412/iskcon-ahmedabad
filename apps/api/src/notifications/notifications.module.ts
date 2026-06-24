import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationsService } from './notifications.service';
import { EmailTemplate } from './models/email-template.model';
import { EmailLog } from './models/email-log.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmailTemplate,
      EmailLog,
    ]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}