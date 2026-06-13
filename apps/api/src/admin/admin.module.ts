import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { User } from '../users/user.model';
import { UserRole } from '../roles/user-role.model';
import { Role } from '../roles/role.model';
import { Centre } from '../centres/centre.model';
import { DevoteeRequest } from '../devotee-requests/devotee-request.model';
import { Trip } from 'src/trips/models/trip.model';
import { TripPayment } from 'src/trips/models/trip-payment.model';
import { Course } from 'src/courses/models/course.model';
import { CoursePayment } from 'src/courses/models/course-payment.model';
import { ContentPost } from 'src/content/models/content-post.model';
import { ContentPayment } from 'src/content/models/content-payment.model';
import { ContentSubscription } from 'src/content/models/content-subscription.model';
import { Donation } from 'src/donations/donation.model';
import { ContentModule } from 'src/content/content.module';
import { TripsModule } from 'src/trips/trips.module';
import { CoursesModule } from 'src/courses/courses.module';
import { Event } from 'src/events/event.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      UserRole,
      Role,
      Centre,
      DevoteeRequest,

      Event,
      Trip,
      TripPayment,
      Course,
      CoursePayment,
      ContentPost,
      ContentPayment,
      ContentSubscription,
      Donation,
      AuthToken
    ]),
    ContentModule,
    TripsModule,
    CoursesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
