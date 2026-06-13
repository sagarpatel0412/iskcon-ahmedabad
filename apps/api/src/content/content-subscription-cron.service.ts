import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { ContentSubscription } from './models/content-subscription.model';

@Injectable()
export class ContentSubscriptionCronService {
  private readonly logger = new Logger(
    ContentSubscriptionCronService.name,
  );

  constructor(
    @InjectModel(ContentSubscription)
    private readonly subscriptionModel: typeof ContentSubscription,
  ) {}

  @Cron('0 * * * *')
  async expireSubscriptions() {
    const [updatedCount] = await this.subscriptionModel.update(
      {
        status: 'expired',
        expired_at: new Date(),
      },
      {
        where: {
          status: 'active',
          end_date: {
            [Op.lt]: new Date(),
          },
        },
      },
    );

    this.logger.log(
      `Expired subscriptions updated: ${updatedCount}`,
    );
  }
}