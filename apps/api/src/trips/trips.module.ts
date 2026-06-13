import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

import { Trip } from './models/trip.model';
import { TripDay } from './models/trip-day.model';
import { TripDayPlace } from './models/trip-day-place.model';
import { TripStay } from './models/trip-stay.model';
import { TripRegistration } from './models/trip-registration.model';
import { TripPayment } from './models/trip-payment.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Trip,
      TripDay,
      TripDayPlace,
      TripStay,
      TripRegistration,
      TripPayment,
      AuthToken
    ]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}