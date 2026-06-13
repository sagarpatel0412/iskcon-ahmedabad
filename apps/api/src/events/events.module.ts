import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { Event } from './event.model';
import { Centre } from '../centres/centre.model';
import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../roles/user-role.model';
import { AuthToken } from '../auth/auth-token.model';
import { EventFormField } from './event-form-field.model';
import { EventRegistration } from './event-registration.model';
import { EventAttendance } from './event-attendance.model';
import { EventPaymentsController } from './event-payments.controller';
import { EventPaymentsService } from './event-payments.service';
import { Payment } from './payment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Event,
      EventFormField,
      Centre,
      User,
      Role,
      UserRole,
      AuthToken,
      EventRegistration,
      EventAttendance,
      Payment
    ])
  ],
  controllers: [EventsController, EventPaymentsController],
  providers: [EventsService, EventPaymentsService],
  exports: [
    EventsService,
    EventPaymentsService,
  ],
})
export class EventsModule { }