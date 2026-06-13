import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Donation } from './donation.model';
import { DonationReceipt } from './donation-receipt.model';
import { AuthToken } from 'src/auth/auth-token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Donation,
      DonationReceipt,
      AuthToken
    ]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}