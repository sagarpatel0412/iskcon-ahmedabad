import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import { Trip } from './models/trip.model';
import { TripDay } from './models/trip-day.model';
import { TripDayPlace } from './models/trip-day-place.model';
import { TripStay } from './models/trip-stay.model';
import { TripRegistration } from './models/trip-registration.model';
import { TripPayment } from './models/trip-payment.model';

import { CreateTripDto } from './dto/create-trip.dto';
import { RegisterTripDto } from './dto/register-trip.dto';
import { VerifyTripPaymentDto } from './dto/verify-trip-payment.dto';

import { User } from '../users/user.model';
import { Centre } from '../centres/centre.model';
import { Op } from 'sequelize';
import { RefundTripPaymentDto } from './dto/refund-trip-payment.dto';

@Injectable()
export class TripsService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Trip)
    private readonly tripModel: typeof Trip,

    @InjectModel(TripDay)
    private readonly tripDayModel: typeof TripDay,

    @InjectModel(TripDayPlace)
    private readonly tripDayPlaceModel: typeof TripDayPlace,

    @InjectModel(TripStay)
    private readonly tripStayModel: typeof TripStay,

    @InjectModel(TripRegistration)
    private readonly registrationModel: typeof TripRegistration,

    @InjectModel(TripPayment)
    private readonly paymentModel: typeof TripPayment,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private isAdmin(user: any) {
    return user?.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN');
  }

  private canManageTrip(trip: Trip, user: User) {
    return trip.created_by === user.id || this.isAdmin(user);
  }

  async findLatestTrips() {
    return this.tripModel.findAll({
      where: {
        status: 'published',
      },
      include: [
        { model: Centre },
        {
          model: User,
          as: 'creator',
          attributes: {
            exclude: ['password_hash'],
          },
        },
        { model: TripStay },
      ],
      order: [['start_date', 'ASC']],
      limit: 4,
    });
  }

  async createTrip(dto: CreateTripDto, user: User) {
    const slug = this.slugify(dto.title);

    const existing = await this.tripModel.findOne({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Trip slug already exists');
    }

    if (new Date(dto.end_date) < new Date(dto.start_date)) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const trip = await this.tripModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id || null,
      created_by: user.id,
      title: dto.title,
      slug,
      description: dto.description || null,
      cover_image_url: dto.cover_image_url || null,
      start_date: dto.start_date,
      end_date: dto.end_date,
      departure_city: dto.departure_city || null,
      destination: dto.destination,
      meeting_point: dto.meeting_point || null,
      meeting_time: dto.meeting_time || null,
      price_amount: dto.price_amount || 0,
      currency: dto.currency || 'INR',
      is_paid: dto.is_paid || false,
      max_capacity: dto.max_capacity || null,
      registration_start_date: dto.registration_start_date
        ? new Date(dto.registration_start_date)
        : null,
      registration_end_date: dto.registration_end_date
        ? new Date(dto.registration_end_date)
        : null,
      includes: dto.includes || null,
      excludes: dto.excludes || null,
      rules: dto.rules || null,
      contact_name: dto.contact_name || null,
      contact_phone: dto.contact_phone || null,
      status: dto.status || 'draft',
    });

    if (Array.isArray(dto.days)) {
      for (const dayItem of dto.days) {
        const day = await this.tripDayModel.create({
          uuid: uuidv4(),
          trip_id: trip.id,
          day_number: dayItem.day_number,
          title: dayItem.title || null,
          description: dayItem.description || null,
          date: dayItem.date || null,
          breakfast_info: dayItem.breakfast_info || null,
          lunch_info: dayItem.lunch_info || null,
          dinner_info: dayItem.dinner_info || null,
        });

        if (Array.isArray(dayItem.places)) {
          for (const place of dayItem.places) {
            await this.tripDayPlaceModel.create({
              uuid: uuidv4(),
              trip_day_id: day.id,
              place_name: place.place_name,
              description: place.description || null,
              visit_time: place.visit_time || null,
              location_url: place.location_url || null,
              image_url: place.image_url || null,
              sort_order: place.sort_order || 1,
            });
          }
        }
      }
    }

    if (Array.isArray(dto.stays)) {
      for (const stay of dto.stays) {
        await this.tripStayModel.create({
          uuid: uuidv4(),
          trip_id: trip.id,
          stay_name: stay.stay_name,
          stay_type: stay.stay_type || 'other',
          address: stay.address || null,
          check_in_date: stay.check_in_date || null,
          check_out_date: stay.check_out_date || null,
          contact_phone: stay.contact_phone || null,
          location_url: stay.location_url || null,
          notes: stay.notes || null,
        });
      }
    }

    return {
      message: 'Trip created successfully',
      trip,
    };
  }

  async findPublishedTrips(query: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const page = query.page > 0 ? query.page : 1;
    const limit = query.limit > 0 ? query.limit : 9;
    const offset = (page - 1) * limit;

    const where: any = {
      status: 'published',
    };

    if (query.search?.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
        { destination: { [Op.like]: `%${query.search}%` } },
        { departure_city: { [Op.like]: `%${query.search}%` } },
        { meeting_point: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.tripModel.findAndCountAll({
      where,
      include: [
        { model: Centre },
        {
          model: User,
          as: 'creator',
          attributes: {
            exclude: ['password_hash'],
          },
        },
        { model: TripStay },
      ],
      order: [['start_date', 'ASC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findTrip(uuid: string) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
      include: [
        { model: Centre },
        { model: User, as: 'creator' },
        {
          model: TripDay,
          include: [{ model: TripDayPlace }],
        },
        { model: TripStay },
      ],
      order: [
        [{ model: TripDay, as: 'days' }, 'day_number', 'ASC'],
        [
          { model: TripDay, as: 'days' },
          { model: TripDayPlace, as: 'places' },
          'sort_order',
          'ASC',
        ],
      ],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async registerTrip(uuid: string, dto: RegisterTripDto, user: User) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.status !== 'published') {
      throw new BadRequestException('Trip is not open for registration');
    }

    const now = new Date();

    if (
      trip.registration_start_date &&
      now < new Date(trip.registration_start_date)
    ) {
      throw new BadRequestException('Registration has not started yet');
    }

    if (
      trip.registration_end_date &&
      now > new Date(trip.registration_end_date)
    ) {
      throw new BadRequestException('Registration has ended');
    }

    const existing = await this.registrationModel.findOne({
      where: {
        trip_id: trip.id,
        user_id: user.id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'You have already registered for this trip',
      );
    }

    if (trip.max_capacity) {
      const confirmedCount = await this.registrationModel.count({
        where: {
          trip_id: trip.id,
          registration_status: 'confirmed',
        },
      });

      if (confirmedCount >= trip.max_capacity) {
        throw new BadRequestException('Trip registration is full');
      }
    }

    const existingPending = await this.registrationModel.findOne({
      where: {
        trip_id: trip.id,
        user_id: user.id,
        registration_status: 'pending',
      },
    });

    if (existingPending) {
      throw new BadRequestException('You already have a pending registration');
    }

    const registration = await this.registrationModel.create({
      uuid: uuidv4(),
      trip_id: trip.id,
      user_id: user.id,
      payment_id: null,
      full_name: dto.full_name,
      phone: dto.phone,
      email: dto.email || null,
      age: dto.age || null,
      gender: dto.gender || null,
      emergency_contact_name: dto.emergency_contact_name || null,
      emergency_contact_phone: dto.emergency_contact_phone || null,
      registration_status: trip.is_paid ? 'pending' : 'confirmed',
      payment_status: trip.is_paid ? 'pending' : 'not_required',
      notes: dto.notes || null,
    });

    if (!trip.is_paid || Number(trip.price_amount) <= 0) {
      return {
        requires_payment: false,
        message: 'Trip registration confirmed successfully',
        registration,
      };
    }

    const amount = Number(trip.price_amount);

    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: trip.currency || 'INR',
      receipt: `TRIP-${trip.id}-${user.id}-${Date.now()}`,
      notes: {
        trip_uuid: trip.uuid,
        registration_uuid: registration.uuid,
        user_id: String(user.id),
      },
    });

    const payment = await this.paymentModel.create({
      uuid: uuidv4(),
      trip_id: trip.id,
      registration_id: registration.id,
      user_id: user.id,
      amount,
      currency: trip.currency || 'INR',
      provider: 'razorpay',
      provider_order_id: order.id,
      payment_status: 'pending',
      raw_response: order as any,
    });

    await registration.update({
      payment_id: payment.id,
    });

    return {
      requires_payment: true,
      message: 'Payment required to confirm trip registration',
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment_uuid: payment.uuid,
      registration,
    };
  }

  async verifyTripPayment(dto: VerifyTripPaymentDto, user: User) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
        user_id: user.id,
        payment_status: 'pending',
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.provider_order_id !== dto.razorpay_order_id) {
      throw new BadRequestException('Order ID mismatch');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (!payment.registration_id) {
      throw new BadRequestException(`Registration id not given`);
    }

    if (generatedSignature !== dto.razorpay_signature) {
      await payment.update({
        payment_status: 'failed',
        failed_reason: 'Invalid Razorpay signature',
        raw_response: dto as any,
      });

      await this.registrationModel.update(
        {
          payment_status: 'failed',
          registration_status: 'pending',
        },
        {
          where: {
            id: payment.registration_id,
          },
        },
      );

      throw new BadRequestException('Invalid payment signature');
    }

    await payment.update({
      payment_status: 'success',
      provider_payment_id: dto.razorpay_payment_id,
      provider_signature: dto.razorpay_signature,
      transaction_id: dto.razorpay_payment_id,
      paid_at: new Date(),
      raw_response: dto as any,
    });

    await this.registrationModel.update(
      {
        payment_status: 'success',
        registration_status: 'confirmed',
      },
      {
        where: {
          id: payment.registration_id,
        },
      },
    );

    return {
      message: 'Trip registration confirmed successfully',
      payment,
    };
  }

  async myRegistrations(user: User) {
    return this.registrationModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [{ model: Trip }, { model: TripPayment }],
      order: [['id', 'DESC']],
    });
  }

  async tripRegistrations(uuid: string, user: User) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (!this.canManageTrip(trip, user)) {
      throw new ForbiddenException(
        'You cannot view registrations for this trip',
      );
    }

    return this.registrationModel.findAll({
      where: {
        trip_id: trip.id,
      },
      include: [{ model: User }, { model: TripPayment }],
      order: [['id', 'DESC']],
    });
  }

  async myCreatedTrips(user: User) {
    return this.tripModel.findAll({
      where: {
        created_by: user.id,
      },
      include: [
        { model: Centre },
        { model: TripStay },
        {
          model: TripRegistration,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async updateTrip(uuid: string, dto: CreateTripDto, user: User) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (!this.canManageTrip(trip, user)) {
      throw new ForbiddenException('You cannot update this trip');
    }

    const slug = dto.title ? this.slugify(dto.title) : trip.slug;

    if (slug && slug !== trip.slug) {
      const existing = await this.tripModel.findOne({
        where: { slug },
      });

      if (existing) {
        throw new BadRequestException('Trip slug already exists');
      }
    }

    if (
      dto.start_date &&
      dto.end_date &&
      new Date(dto.end_date) < new Date(dto.start_date)
    ) {
      throw new BadRequestException('End date cannot be before start date');
    }

    await trip.update({
      centre_id: dto.centre_id ?? trip.centre_id,
      title: dto.title ?? trip.title,
      slug,
      description: dto.description ?? trip.description,
      cover_image_url: dto.cover_image_url ?? trip.cover_image_url,
      start_date: dto.start_date ?? trip.start_date,
      end_date: dto.end_date ?? trip.end_date,
      departure_city: dto.departure_city ?? trip.departure_city,
      destination: dto.destination ?? trip.destination,
      meeting_point: dto.meeting_point ?? trip.meeting_point,
      meeting_time: dto.meeting_time ?? trip.meeting_time,
      price_amount: dto.price_amount ?? trip.price_amount,
      currency: dto.currency ?? trip.currency,
      is_paid: dto.is_paid ?? trip.is_paid,
      max_capacity: dto.max_capacity ?? trip.max_capacity,
      registration_start_date: dto.registration_start_date
        ? new Date(dto.registration_start_date)
        : trip.registration_start_date,
      registration_end_date: dto.registration_end_date
        ? new Date(dto.registration_end_date)
        : trip.registration_end_date,
      includes: dto.includes ?? trip.includes,
      excludes: dto.excludes ?? trip.excludes,
      rules: dto.rules ?? trip.rules,
      contact_name: dto.contact_name ?? trip.contact_name,
      contact_phone: dto.contact_phone ?? trip.contact_phone,
      status: dto.status ?? trip.status,
    });

    if (Array.isArray(dto.days)) {
      await this.tripDayModel.destroy({
        where: {
          trip_id: trip.id,
        },
      });

      for (const dayItem of dto.days) {
        const day = await this.tripDayModel.create({
          uuid: uuidv4(),
          trip_id: trip.id,
          day_number: dayItem.day_number,
          title: dayItem.title || null,
          description: dayItem.description || null,
          date: dayItem.date || null,
          breakfast_info: dayItem.breakfast_info || null,
          lunch_info: dayItem.lunch_info || null,
          dinner_info: dayItem.dinner_info || null,
        });

        if (Array.isArray(dayItem.places)) {
          for (const place of dayItem.places) {
            await this.tripDayPlaceModel.create({
              uuid: uuidv4(),
              trip_day_id: day.id,
              place_name: place.place_name,
              description: place.description || null,
              visit_time: place.visit_time || null,
              location_url: place.location_url || null,
              image_url: place.image_url || null,
              sort_order: place.sort_order || 1,
            });
          }
        }
      }
    }

    if (Array.isArray(dto.stays)) {
      await this.tripStayModel.destroy({
        where: {
          trip_id: trip.id,
        },
      });

      for (const stay of dto.stays) {
        await this.tripStayModel.create({
          uuid: uuidv4(),
          trip_id: trip.id,
          stay_name: stay.stay_name,
          stay_type: stay.stay_type || 'other',
          address: stay.address || null,
          check_in_date: stay.check_in_date || null,
          check_out_date: stay.check_out_date || null,
          contact_phone: stay.contact_phone || null,
          location_url: stay.location_url || null,
          notes: stay.notes || null,
        });
      }
    }

    return {
      message: 'Trip updated successfully',
      trip,
    };
  }

  async paymentDetails(paymentUuid: string, user: User) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: paymentUuid,
        user_id: user.id,
      },
      include: [{ model: Trip }, { model: TripRegistration }],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async cancelRegistration(registrationUuid: string, user: User) {
    const registration = await this.registrationModel.findOne({
      where: {
        uuid: registrationUuid,
        user_id: user.id,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.registration_status === 'confirmed') {
      throw new BadRequestException(
        'Confirmed registrations cannot be cancelled',
      );
    }

    registration.registration_status = 'cancelled';

    await registration.save();

    return {
      message: 'Registration cancelled',
    };
  }

  async requestRefund(dto: RefundTripPaymentDto, user: User) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
        user_id: user.id,
        payment_status: 'success',
      },
    });

    if (!payment) {
      throw new NotFoundException('Successful payment not found');
    }

    if (
      payment.payment_status === 'refund_pending' ||
      payment.payment_status === 'refunded'
    ) {
      throw new BadRequestException('Refund already requested');
    }

    await payment.update({
      payment_status: 'refund_pending',
      refund_reason: dto.refund_reason || 'User requested refund',
    });

    return {
      message: 'Refund request submitted successfully',
    };
  }

  async processRefund(dto: RefundTripPaymentDto, admin: User) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
      },
      include: [
        {
          model: TripRegistration,
        },
      ],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.payment_status === 'refunded') {
      throw new BadRequestException('Already refunded');
    }

    try {
      const refund = await this.razorpay.payments.refund(
        payment.provider_payment_id!,
        {
          amount: Math.round(Number(payment.amount) * 100),
          notes: {
            payment_uuid: payment.uuid,
            refunded_by: String(admin.id),
          },
        },
      );

      await payment.update({
        payment_status: 'refunded',
        provider_refund_id: refund.id,
        refunded_at: new Date(),
        raw_response: refund as any,
      });

      if (payment.registration_id) {
        await this.registrationModel.update(
          {
            registration_status: 'cancelled',
            payment_status: 'refunded',
          },
          {
            where: {
              id: payment.registration_id,
            },
          },
        );
      }

      return {
        message: 'Refund processed successfully',
        refund,
      };
    } catch (error: any) {
      await payment.update({
        payment_status: 'refund_failed',
        failed_reason: error?.message || 'Refund failed',
      });

      throw new BadRequestException(error?.message || 'Refund failed');
    }
  }

  async expirePendingTripPayments() {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);

    const payments = await this.paymentModel.findAll({
      where: {
        payment_status: 'pending',
        createdAt: {
          [Op.lt]: cutoff,
        },
      },
    });

    for (const payment of payments) {
      await payment.update({
        payment_status: 'failed',
        failed_reason: 'Payment timeout',
      });

      if (payment.registration_id) {
        await this.registrationModel.update(
          {
            registration_status: 'cancelled',
            payment_status: 'failed',
          },
          {
            where: {
              id: payment.registration_id,
            },
          },
        );
      }
    }

    return {
      message: 'Pending trip payments expired',
      count: payments.length,
    };
  }

  async razorpayWebhook(body: any, req: any) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    const signature = req.headers['x-razorpay-signature'];

    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;

    if (!paymentEntity) {
      return { received: true };
    }

    const providerPaymentId = paymentEntity.id;
    const providerOrderId = paymentEntity.order_id;

    const payment = await this.paymentModel.findOne({
      where: {
        provider_order_id: providerOrderId,
      },
    });

    if (!payment) {
      return { received: true, message: 'Payment not found locally' };
    }

    if (event === 'payment.captured' && payment.payment_status !== 'success') {
      await payment.update({
        payment_status: 'success',
        provider_payment_id: providerPaymentId,
        transaction_id: providerPaymentId,
        paid_at: new Date(),
        raw_response: body,
      });

      if (payment.registration_id) {
        await this.registrationModel.update(
          {
            payment_status: 'success',
            registration_status: 'confirmed',
          },
          {
            where: {
              id: payment.registration_id,
            },
          },
        );
      }
    }

    if (event === 'payment.failed') {
      await payment.update({
        payment_status: 'failed',
        failed_reason: paymentEntity.error_description || 'Payment failed',
        raw_response: body,
      });

      if (payment.registration_id) {
        await this.registrationModel.update(
          {
            payment_status: 'failed',
            registration_status: 'pending',
          },
          {
            where: {
              id: payment.registration_id,
            },
          },
        );
      }
    }

    if (event === 'refund.processed') {
      await payment.update({
        payment_status: 'refunded',
        provider_refund_id: body.payload.refund.entity.id,
        refunded_at: new Date(),
        raw_response: body,
      });

      if (payment.registration_id) {
        await this.registrationModel.update(
          {
            registration_status: 'cancelled',
            payment_status: 'refunded',
          },
          {
            where: {
              id: payment.registration_id,
            },
          },
        );
      }
    }

    return {
      received: true,
    };
  }

  async uploadCoverImage(
    tripUuid: string,
    file: Express.Multer.File,
    user: User,
  ) {
    const trip = await this.tripModel.findOne({
      where: { uuid: tripUuid },
    });

    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    const isCreator = trip.created_by === user.id;

    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'Only trip creator or admin can upload cover image',
      );
    }

    const coverImageUrl = `/uploads/trips/${file.filename}`;

    await trip.update({
      cover_image_url: coverImageUrl,
    });

    return {
      message: 'Cover image uploaded successfully',
      cover_image_url: coverImageUrl,
      trip,
    };
  }
}
