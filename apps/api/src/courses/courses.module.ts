import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

import { Course } from './models/course.model';
import { CourseSession } from './models/course-session.model';
import { CourseRegistration } from './models/course-registration.model';
import { CoursePayment } from './models/course-payment.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Course,
      CourseSession,
      CourseRegistration,
      CoursePayment,
      AuthToken
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}