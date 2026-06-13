import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { Payment } from './payment.model';
import { Event } from '../events/event.model';
import { EventsService } from '../events/events.service';
import { CreateEventPaymentOrderDto } from './dto/create-event-payment-order.dto';
import { VerifyEventPaymentDto } from './dto/verify-event-payment.dto';
import { EventRegistration } from './event-registration.model';

@Injectable()
export class EventPaymentsService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,

    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,

    private readonly eventsService: EventsService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(dto: CreateEventPaymentOrderDto, user: any) {
    const event = await this.eventModel.findOne({
      where: { uuid: dto.event_uuid },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'published') {
      throw new BadRequestException('Event is not open for registration');
    }

    if (
      event.registration_start_at &&
      event.registration_start_at > new Date()
    ) {
      throw new BadRequestException('Registration has not started yet');
    }

    if (event.registration_end_at && event.registration_end_at < new Date()) {
      throw new BadRequestException('Registration is closed');
    }

    const existingRegistration = await this.eventRegistrationModel.findOne({
      where: {
        event_id: event.id,
        user_id: user.id,
      },
    });

    if (existingRegistration) {
      throw new BadRequestException(
        'You are already registered for this event',
      );
    }

    if (event.max_capacity) {
      const count = await this.eventRegistrationModel.count({
        where: {
          event_id: event.id,
          status: 'registered',
        },
      });

      if (count >= event.max_capacity) {
        throw new BadRequestException('Event registration is full');
      }
    }

    const amount = Number(event.price_amount || 0);

    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid event price');
    }

    const existingPaidPayment = await this.paymentModel.findOne({
      where: {
        user_id: user.id,
        payable_type: 'event',
        payable_id: event.id,
        status: 'paid',
      },
    });

    if (existingPaidPayment) {
      throw new BadRequestException('Payment already completed for this event');
    }

    const amountInPaise = Math.round(amount * 100);

    const razorpayOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: event.currency || 'INR',
      receipt: `EVT-${event.id}-${Date.now()}`,
      notes: {
        event_uuid: event.uuid,
        user_id: String(user.id),
      },
    });

    const payment = await this.paymentModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      centre_id: event.centre_id,
      payable_type: 'event',
      payable_id: event.id,
      amount,
      currency: event.currency || 'INR',
      provider: 'razorpay',
      provider_order_id: razorpayOrder.id,
      status: 'created',
      raw_response: razorpayOrder as any,
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      payment_uuid: payment.uuid,
      event_uuid: event.uuid,
    };
  }

  async verifyPayment(dto: VerifyEventPaymentDto, user: any) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
        user_id: user.id,
        payable_type: 'event',
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === 'paid') {
      throw new BadRequestException('Payment already verified');
    }

    if (payment.provider_order_id !== dto.razorpay_order_id) {
      throw new BadRequestException('Order id mismatch');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      await payment.update({
        status: 'failed',
        failed_reason: 'Invalid Razorpay signature',
        raw_response: dto as any,
      });

      throw new BadRequestException('Invalid payment signature');
    }

    const event = await this.eventModel.findByPk(payment.payable_id);

    if (!event) {
      throw new NotFoundException('Event not found for payment');
    }

    await payment.update({
      status: 'paid',
      provider_payment_id: dto.razorpay_payment_id,
      provider_signature: dto.razorpay_signature,
      paid_at: new Date(),
      raw_response: dto as any,
    });

    const registration = await this.eventsService.registerPaidEventAfterPayment(
      event.uuid,
      {
        form_answers: dto.form_answers ?? null,
        payment_id: payment.id,
      },
      user,
    );

    return {
      message: 'Payment successful and event registered successfully',
      payment,
      registration,
    };
  }
}
