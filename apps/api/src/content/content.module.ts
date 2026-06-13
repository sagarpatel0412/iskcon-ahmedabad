import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContentPost } from './models/content-post.model';
import { ContentCategory } from './models/content-category.model';
import { ContentPostCategory } from './models/content-post-category.model';
import { ContentMedia } from './models/content-media.model';
import { ContentLike } from './models/content-like.model';
import { ContentBookmark } from './models/content-bookmark.model';
import { ContentComment } from './models/content-comment.model';
import { ContentSubscription } from './models/content-subscription.model';
import { ContentPayment } from './models/content-payment.model';
import { ContentPostPurchase } from './models/content-post-purchase.model';
import { ContentPostTag } from './models/content-post-tag.model';
import { ContentTag } from './models/content-tag.model';
import { AuthToken } from 'src/auth/auth-token.model';
import { ContentSubscriptionPlan } from './models/content-subscription-plan.model';
import { ContentSubscriptionCronService } from './content-subscription-cron.service';
import { ProgressLevel } from 'src/daily-progress/progress-level.model';
import { DailyProgressModule } from 'src/daily-progress/daily-progress.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ContentPost,
      ContentCategory,
      ContentPostCategory,
      ContentMedia,
      ContentLike,
      ContentBookmark,
      ContentComment,
      ContentSubscription,
      ContentPayment,
      ContentPostPurchase,
      ContentPostTag,
      ContentTag,
      AuthToken,
      ContentSubscriptionPlan,
      ProgressLevel,
      AuthToken
    ]),
    DailyProgressModule
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentSubscriptionCronService],
  exports: [ContentService, ContentSubscriptionCronService],
})
export class ContentModule { }
