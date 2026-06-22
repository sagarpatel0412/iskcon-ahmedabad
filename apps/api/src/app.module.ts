import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CentresModule } from './centres/centres.module';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { UserRole } from './roles/user-role.model';
import { Centre } from './centres/centre.model';
import { AuthToken } from './auth/auth-token.model';
import { DevoteeRequestsModule } from './devotee-requests/devotee-requests.module';
import { DevoteeRequest } from './devotee-requests/devotee-request.model';
import { OtpVerification } from './auth/otp-verification.model';
import { MailService } from './common/services/mail.service';
import { EventsModule } from './events/events.module';
import { Event } from './events/event.model';
import { EventFormField } from './events/event-form-field.model';
import { EventRegistration } from './events/event-registration.model';
import { EventAttendance } from './events/event-attendance.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LocationModule } from './location/location.module';
import { DailyProgressModule } from './daily-progress/daily-progress.module';
import { DailyProgress } from './daily-progress/daily-progress.model';
import { ContentModule } from './content/content.module';
import { ContentCategory } from './content/models/content-category.model';
import { ContentPostCategory } from './content/models/content-post-category.model';
import { ContentMedia } from './content/models/content-media.model';
import { ContentLike } from './content/models/content-like.model';
import { ContentBookmark } from './content/models/content-bookmark.model';
import { ContentComment } from './content/models/content-comment.model';
import { ContentSubscription } from './content/models/content-subscription.model';
import { ContentPayment } from './content/models/content-payment.model';
import { ContentPostPurchase } from './content/models/content-post-purchase.model';
import { ContentPost } from './content/models/content-post.model';
import { ContentTag } from './content/models/content-tag.model';
import { ContentPostTag } from './content/models/content-post-tag.model';
import { DonationsModule } from './donations/donations.module';
import { Payment } from './events/payment.model';
import { Donation } from './donations/donation.model';
import { DonationReceipt } from './donations/donation-receipt.model';
import { ContentSubscriptionPlan } from './content/models/content-subscription-plan.model';
import { TripsModule } from './trips/trips.module';
import { Trip } from './trips/models/trip.model';
import { TripDay } from './trips/models/trip-day.model';
import { TripDayPlace } from './trips/models/trip-day-place.model';
import { TripStay } from './trips/models/trip-stay.model';
import { TripRegistration } from './trips/models/trip-registration.model';
import { TripPayment } from './trips/models/trip-payment.model';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/models/course.model';
import { CourseSession } from './courses/models/course-session.model';
import { CourseRegistration } from './courses/models/course-registration.model';
import { CoursePayment } from './courses/models/course-payment.model';
import { ProgressLevel } from './daily-progress/progress-level.model';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { ContactMessage } from './support/models/contact-message.model';
import { ProblemReport } from './support/models/problem-report.model';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<number>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'),
        password: 'root@123',
        database: config.get<string>('DB_NAME'),
        models: [
          User,
          Role,
          UserRole,
          Centre,
          AuthToken,
          DevoteeRequest,
          OtpVerification,
          Event,
          EventFormField,
          EventRegistration,
          EventAttendance,
          DailyProgress,
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
          Payment,
          Donation,
          DonationReceipt,
          ContentSubscriptionPlan,
          Trip,
          TripDay,
          TripDayPlace,
          TripStay,
          TripRegistration,
          TripPayment,
          Course,
          CourseSession,
          CourseRegistration,
          CoursePayment,
          ProgressLevel,
          ContactMessage,
          ProblemReport,
        ],
        autoLoadModels: true,
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CentresModule,
    DevoteeRequestsModule,
    EventsModule,
    LocationModule,
    DailyProgressModule,
    ContentModule,
    DonationsModule,
    TripsModule,
    CoursesModule,
    AdminModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
