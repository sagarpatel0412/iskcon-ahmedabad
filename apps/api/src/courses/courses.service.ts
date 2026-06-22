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

import { Course } from './models/course.model';
import { CourseSession } from './models/course-session.model';
import { CourseRegistration } from './models/course-registration.model';
import { CoursePayment } from './models/course-payment.model';

import { CreateCourseDto } from './dto/create-course.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { AddCourseUsersDto } from './dto/add-course-users.dto';
import { VerifyCoursePaymentDto } from './dto/verify-course-payment.dto';
import { RefundCoursePaymentDto } from './dto/refund-course-payment.dto';

import { User } from '../users/user.model';
import { Centre } from '../centres/centre.model';
import { Op } from 'sequelize';

@Injectable()
export class CoursesService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Course)
    private readonly courseModel: typeof Course,

    @InjectModel(CourseSession)
    private readonly sessionModel: typeof CourseSession,

    @InjectModel(CourseRegistration)
    private readonly registrationModel: typeof CourseRegistration,

    @InjectModel(CoursePayment)
    private readonly paymentModel: typeof CoursePayment,
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

  private canManageCourse(course: Course, user: User) {
    return course.created_by === user.id || this.isAdmin(user);
  }

  async createCourse(dto: CreateCourseDto, user: User) {
    const slug = this.slugify(dto.title);

    const existing = await this.courseModel.findOne({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Course slug already exists');
    }

    if (new Date(dto.end_date) < new Date(dto.start_date)) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const course = await this.courseModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id || null,
      created_by: user.id,
      title: dto.title,
      slug,
      description: dto.description || null,
      cover_image_url: dto.cover_image_url || null,
      course_mode: dto.course_mode || 'offline',
      venue_name: dto.venue_name || null,
      venue_address: dto.venue_address || null,
      online_meeting_url: dto.online_meeting_url || null,
      start_date: dto.start_date,
      end_date: dto.end_date,
      start_time: dto.start_time || null,
      end_time: dto.end_time || null,
      max_capacity: dto.max_capacity || null,
      is_paid: dto.is_paid || false,
      price_amount: dto.price_amount || 0,
      currency: dto.currency || 'INR',
      registration_start_date: dto.registration_start_date
        ? new Date(dto.registration_start_date)
        : null,
      registration_end_date: dto.registration_end_date
        ? new Date(dto.registration_end_date)
        : null,
      what_you_will_learn: dto.what_you_will_learn || null,
      requirements: dto.requirements || null,
      rules: dto.rules || null,
      contact_name: dto.contact_name || null,
      contact_phone: dto.contact_phone || null,
      status: dto.status || 'draft',
    });

    if (Array.isArray(dto.sessions)) {
      for (const item of dto.sessions) {
        await this.sessionModel.create({
          uuid: uuidv4(),
          course_id: course.id,
          session_number: item.session_number,
          title: item.title,
          description: item.description || null,
          session_date: item.session_date,
          start_time: item.start_time || null,
          end_time: item.end_time || null,
          venue_name: item.venue_name || dto.venue_name || null,
          venue_address: item.venue_address || dto.venue_address || null,
          online_meeting_url:
            item.online_meeting_url || dto.online_meeting_url || null,
        });
      }
    }

    return {
      message: 'Course created successfully',
      course,
    };
  }

  async findPublishedCourses(query: {
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
        { venue_name: { [Op.like]: `%${query.search}%` } },
        { venue_address: { [Op.like]: `%${query.search}%` } },
        { course_mode: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.courseModel.findAndCountAll({
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
        { model: CourseSession },
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

  async findCourse(uuid: string) {
    const course = await this.courseModel.findOne({
      where: { uuid },
      include: [
        { model: Centre },
        { model: User, as: 'creator' },
        { model: CourseSession },
      ],
      order: [[{ model: CourseSession, as: 'sessions' }, 'session_number', 'ASC']],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async updateCourse(uuid: string, dto: CreateCourseDto, user: User) {
    const course = await this.courseModel.findOne({
      where: { uuid },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!this.canManageCourse(course, user)) {
      throw new ForbiddenException('You cannot update this course');
    }

    const slug = dto.title ? this.slugify(dto.title) : course.slug;

    if (slug && slug !== course.slug) {
      const existing = await this.courseModel.findOne({
        where: { slug },
      });

      if (existing) {
        throw new BadRequestException('Course slug already exists');
      }
    }

    await course.update({
      centre_id: dto.centre_id ?? course.centre_id,
      title: dto.title ?? course.title,
      slug,
      description: dto.description ?? course.description,
      cover_image_url: dto.cover_image_url ?? course.cover_image_url,
      course_mode: dto.course_mode ?? course.course_mode,
      venue_name: dto.venue_name ?? course.venue_name,
      venue_address: dto.venue_address ?? course.venue_address,
      online_meeting_url: dto.online_meeting_url ?? course.online_meeting_url,
      start_date: dto.start_date ?? course.start_date,
      end_date: dto.end_date ?? course.end_date,
      start_time: dto.start_time ?? course.start_time,
      end_time: dto.end_time ?? course.end_time,
      max_capacity: dto.max_capacity ?? course.max_capacity,
      is_paid: dto.is_paid ?? course.is_paid,
      price_amount: dto.price_amount ?? course.price_amount,
      currency: dto.currency ?? course.currency,
      registration_start_date: dto.registration_start_date
        ? new Date(dto.registration_start_date)
        : course.registration_start_date,
      registration_end_date: dto.registration_end_date
        ? new Date(dto.registration_end_date)
        : course.registration_end_date,
      what_you_will_learn:
        dto.what_you_will_learn ?? course.what_you_will_learn,
      requirements: dto.requirements ?? course.requirements,
      rules: dto.rules ?? course.rules,
      contact_name: dto.contact_name ?? course.contact_name,
      contact_phone: dto.contact_phone ?? course.contact_phone,
      status: dto.status ?? course.status,
    });

    if (Array.isArray(dto.sessions)) {
      await this.sessionModel.destroy({
        where: {
          course_id: course.id,
        },
      });

      for (const item of dto.sessions) {
        await this.sessionModel.create({
          uuid: uuidv4(),
          course_id: course.id,
          session_number: item.session_number,
          title: item.title,
          description: item.description || null,
          session_date: item.session_date,
          start_time: item.start_time || null,
          end_time: item.end_time || null,
          venue_name: item.venue_name || dto.venue_name || null,
          venue_address: item.venue_address || dto.venue_address || null,
          online_meeting_url:
            item.online_meeting_url || dto.online_meeting_url || null,
        });
      }
    }

    return {
      message: 'Course updated successfully',
      course,
    };
  }

  async enrollCourse(uuid: string, dto: EnrollCourseDto, user: User) {
    const course = await this.courseModel.findOne({
      where: { uuid },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'published') {
      throw new BadRequestException('Course is not open for registration');
    }

    const now = new Date();

    if (
      course.registration_start_date &&
      now < new Date(course.registration_start_date)
    ) {
      throw new BadRequestException('Registration has not started yet');
    }

    if (
      course.registration_end_date &&
      now > new Date(course.registration_end_date)
    ) {
      throw new BadRequestException('Registration has ended');
    }

    const existing = await this.registrationModel.findOne({
      where: {
        course_id: course.id,
        user_id: user.id,
      },
    });

    if (existing) {
      throw new BadRequestException('You are already registered for this course');
    }

    if (course.max_capacity) {
      const confirmedCount = await this.registrationModel.count({
        where: {
          course_id: course.id,
          registration_status: 'confirmed',
        },
      });

      if (confirmedCount >= course.max_capacity) {
        throw new BadRequestException('Course is full');
      }
    }

    const registration = await this.registrationModel.create({
      uuid: uuidv4(),
      course_id: course.id,
      user_id: user.id,
      payment_id: null,
      full_name: dto.full_name,
      phone: dto.phone || null,
      email: dto.email || user.email || null,
      registration_source: 'self',
      registration_status: course.is_paid ? 'pending' : 'confirmed',
      payment_status: course.is_paid ? 'pending' : 'not_required',
      notes: dto.notes || null,
    });

    if (!course.is_paid || Number(course.price_amount) <= 0) {
      // TODO: send invite email here
      return {
        requires_payment: false,
        message: 'Course registration confirmed successfully',
        registration,
      };
    }

    const amount = Number(course.price_amount);

    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: course.currency || 'INR',
      receipt: `COURSE-${course.id}-${user.id}-${Date.now()}`,
      notes: {
        course_uuid: course.uuid,
        registration_uuid: registration.uuid,
        user_id: String(user.id),
      },
    });

    const payment = await this.paymentModel.create({
      uuid: uuidv4(),
      course_id: course.id,
      registration_id: registration.id,
      user_id: user.id,
      amount,
      currency: course.currency || 'INR',
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
      message: 'Payment required to confirm course registration',
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment_uuid: payment.uuid,
      registration,
    };
  }

  async addUsersToCourse(uuid: string, dto: AddCourseUsersDto, user: User) {
    const course = await this.courseModel.findOne({
      where: { uuid },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!this.canManageCourse(course, user)) {
      throw new ForbiddenException('You cannot add users to this course');
    }

    const created: CourseRegistration[] = [];
    const skipped: number[] = [];

    for (const userId of dto.user_ids) {
      const existing = await this.registrationModel.findOne({
        where: {
          course_id: course.id,
          user_id: userId,
        },
      });

      if (existing) {
        skipped.push(userId);
        continue;
      }

      const targetUser = await User.findByPk(userId);

      if (!targetUser) {
        skipped.push(userId);
        continue;
      }

      const registration = await this.registrationModel.create({
        uuid: uuidv4(),
        course_id: course.id,
        user_id: targetUser.id,
        payment_id: null,
        full_name:
          `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim(),
        phone: targetUser.phone || null,
        email: targetUser.email || null,
        registration_source:
          dto.registration_source ||
          (this.isAdmin(user) ? 'admin_added' : 'added_by_creator'),
        registration_status: course.is_paid ? 'pending' : 'confirmed',
        payment_status: course.is_paid ? 'pending' : 'not_required',
        notes: dto.notes || null,
      });

      // TODO: send invite email here
      created.push(registration);
    }

    return {
      message: 'Users processed successfully',
      added_count: created.length,
      skipped_user_ids: skipped,
      registrations: created,
    };
  }

  async verifyCoursePayment(dto: VerifyCoursePaymentDto, user: User) {
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

    if(!payment.registration_id){
      throw new NotFoundException('Registration id not found');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

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

    // TODO: send invite email here

    return {
      message: 'Course registration confirmed successfully',
      payment,
    };
  }

  async myRegisteredCourses(user: User) {
    return this.registrationModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [{ model: Course }, { model: CoursePayment }],
      order: [['id', 'DESC']],
    });
  }

  async myCreatedCourses(user: User) {
    return this.courseModel.findAll({
      where: {
        created_by: user.id,
      },
      include: [{ model: CourseSession }, { model: CourseRegistration }],
      order: [['id', 'DESC']],
    });
  }

  async courseRegistrations(uuid: string, user: User) {
    const course = await this.courseModel.findOne({
      where: { uuid },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!this.canManageCourse(course, user)) {
      throw new ForbiddenException(
        'You cannot view registrations for this course',
      );
    }

    return this.registrationModel.findAll({
      where: {
        course_id: course.id,
      },
      include: [{ model: User }, { model: CoursePayment }],
      order: [['id', 'DESC']],
    });
  }

  async refundPayment(paymentUuid: string, dto: RefundCoursePaymentDto) {
    const payment = await this.paymentModel.findOne({
      where: {
        uuid: paymentUuid,
        payment_status: 'success',
      },
    });

    if (!payment) {
      throw new NotFoundException('Successful payment not found');
    }

    if (!payment.provider_payment_id) {
      throw new BadRequestException('Razorpay payment id not found');
    }

    if(!payment.registration_id){
      throw new NotFoundException('Registration id not found');
    }

    try {
      await payment.update({
        payment_status: 'refund_pending',
        refund_reason: dto.reason || 'Refund initiated by admin',
      });

      const refund = await this.razorpay.payments.refund(
        payment.provider_payment_id,
        {
          amount: Math.round(Number(payment.amount) * 100),
          notes: {
            reason: dto.reason || 'Course refund processed by admin',
            payment_uuid: payment.uuid,
          },
        },
      );

      await payment.update({
        payment_status: 'refunded',
        provider_refund_id: refund.id,
        refunded_at: new Date(),
        refund_reason: dto.reason || 'Course refund processed by admin',
        raw_response: {
          payment_response: payment.raw_response,
          refund_response: refund,
        },
      });

      await this.registrationModel.update(
        {
          payment_status: 'refunded',
          registration_status: 'cancelled',
        },
        {
          where: {
            id: payment.registration_id,
          },
        },
      );

      return {
        message: 'Refund processed successfully',
        refund,
        payment,
      };
    } catch (error: any) {
      await payment.update({
        payment_status: 'refund_failed',
        failed_reason: error?.message || 'Refund failed',
      });

      throw new BadRequestException(error?.message || 'Refund failed');
    }
  }

  async uploadCoverImage(
    courseUuid: string,
    file: Express.Multer.File,
    user: User,
  ) {
    const course = await this.courseModel.findOne({
      where: { uuid: courseUuid },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const isCreator = course.created_by === user.id;

    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'Only course creator or admin can upload cover image',
      );
    }

    const coverImageUrl = `/uploads/courses/${file.filename}`;

    await course.update({
      cover_image_url: coverImageUrl,
    });

    return {
      message: 'Cover image uploaded successfully',
      cover_image_url: coverImageUrl,
      course,
    };
  }
}