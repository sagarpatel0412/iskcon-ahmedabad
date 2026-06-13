import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { User } from '../users/user.model';
import { UserRole } from '../roles/user-role.model';
import { Role } from '../roles/role.model';
import { Centre } from '../centres/centre.model';
import { DevoteeRequest } from '../devotee-requests/devotee-request.model';

import { ReviewDevoteeRequestDto } from './dto/review-devotee-request.dto';
import { Trip } from 'src/trips/models/trip.model';
import { TripPayment } from 'src/trips/models/trip-payment.model';
import { Course } from 'src/courses/models/course.model';
import { CoursePayment } from 'src/courses/models/course-payment.model';
import { ContentPost } from 'src/content/models/content-post.model';
import { ContentPayment } from 'src/content/models/content-payment.model';
import { ContentSubscription } from 'src/content/models/content-subscription.model';
import { Donation } from 'src/donations/donation.model';
import { ContentService } from 'src/content/content.service';
import { TripsService } from 'src/trips/trips.service';
import { CoursesService } from 'src/courses/courses.service';
import { Event } from 'src/events/event.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(DevoteeRequest)
    private readonly devoteeRequestModel: typeof DevoteeRequest,

    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(Trip) private readonly tripModel: typeof Trip,
    @InjectModel(TripPayment)
    private readonly tripPaymentModel: typeof TripPayment,
    @InjectModel(Course) private readonly courseModel: typeof Course,
    @InjectModel(CoursePayment)
    private readonly coursePaymentModel: typeof CoursePayment,
    @InjectModel(ContentPost)
    private readonly contentPostModel: typeof ContentPost,
    @InjectModel(ContentPayment)
    private readonly contentPaymentModel: typeof ContentPayment,
    @InjectModel(ContentSubscription)
    private readonly subscriptionModel: typeof ContentSubscription,
    @InjectModel(Donation) private readonly donationModel: typeof Donation,

    private readonly contentService: ContentService,
    private readonly tripsService: TripsService,
    private readonly coursesService: CoursesService,
  ) {}

  private cleanUser(user: User) {
    const plain = user.get({ plain: true }) as any;
    delete plain.password_hash;
    return plain;
  }

  async users(filters: {
    search?: string;
    status?: string;
    verified?: string;
  }) {
    const where: any = {};

    if (filters.status === 'active') {
      where.is_active = true;
    }

    if (filters.status === 'inactive') {
      where.is_active = false;
    }

    if (filters.verified === 'true') {
      where.is_verified_devotee = true;
    }

    if (filters.verified === 'false') {
      where.is_verified_devotee = false;
    }

    if (filters.search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${filters.search}%` } },
        { last_name: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } },
        { phone: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const users = await this.userModel.findAll({
      where,
      include: [
        { model: Centre },
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
      order: [['id', 'DESC']],
    });

    return users.map((user) => this.cleanUser(user));
  }

  async userDetails(uuid: string) {
    const user = await this.userModel.findOne({
      where: { uuid },
      include: [
        { model: Centre },
        {
          model: UserRole,
          include: [{ model: Role }],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const devoteeRequests = await this.devoteeRequestModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: User,
          include: [
            { model: Centre },
            {
              model: UserRole,
              include: [{ model: Role }],
            },
          ],
        },
        { model: Centre },
      ],
      order: [['id', 'DESC']],
    });

    return {
      user: this.cleanUser(user),
      devoteeRequests,
    };
  }

  async setDevoteeVerification(uuid: string, value: boolean) {
    const user = await this.userModel.findOne({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      is_verified_devotee: value,
    });

    return {
      message: value
        ? 'User verified as devotee successfully'
        : 'User devotee verification removed successfully',
      user: this.cleanUser(user),
    };
  }

  async setUserActiveStatus(uuid: string, value: boolean) {
    const user = await this.userModel.findOne({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      is_active: value,
    });

    return {
      message: value
        ? 'User activated successfully'
        : 'User deactivated successfully',
      user: this.cleanUser(user),
    };
  }

  async devoteeRequests(status?: string) {
    const where: any = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status;
    }

    return this.devoteeRequestModel.findAll({
      where,
      include: [
        {
          model: User,
          include: [
            { model: Centre },
            {
              model: UserRole,
              include: [{ model: Role }],
            },
          ],
        },
        { model: Centre },
        { model: User, as: 'user' },
      ],
      order: [['id', 'DESC']],
    });
  }

  async devoteeRequestDetails(uuid: string) {
    const request = await this.devoteeRequestModel.findOne({
      where: { uuid },
      include: [
        {
          model: User,
          include: [
            { model: Centre },
            {
              model: UserRole,
              include: [{ model: Role }],
            },
          ],
        },
        { model: Centre },
      ],
    });

    if (!request) {
      throw new NotFoundException('Devotee request not found');
    }

    return request;
  }

  async reviewDevoteeRequest(
    uuid: string,
    dto: ReviewDevoteeRequestDto,
    adminUser: User,
  ) {
    const request = await this.devoteeRequestModel.findOne({
      where: { uuid },
      include: [{ model: User }],
    });

    if (!request) {
      throw new NotFoundException('Devotee request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('This request is already reviewed');
    }

    await request.update({
      status: dto.status,
      reviewed_by: adminUser.id,
      reviewed_at: new Date(),
      reason: dto.reason ?? request.reason,
    });

    if (dto.status === 'approved') {
      const user = await this.userModel.findByPk(request.user_id);

      if (!user) {
        throw new NotFoundException('Request user not found');
      }

      await user.update({
        is_verified_devotee: true,
      });
    }

    if (dto.status === 'rejected') {
      const user = await this.userModel.findByPk(request.user_id);

      if (user) {
        await user.update({
          is_verified_devotee: false,
        });
      }
    }

    return {
      message:
        dto.status === 'approved'
          ? 'Devotee request approved successfully'
          : 'Devotee request rejected successfully',
      request,
    };
  }

  async adminEvents() {
    return this.eventModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminTrips() {
    return this.tripModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminCourses() {
    return this.courseModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminContent() {
    return this.contentPostModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminContentPayments() {
    return this.contentPaymentModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminTripPayments() {
    return this.tripPaymentModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminCoursePayments() {
    return this.coursePaymentModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminSubscriptions() {
    return this.subscriptionModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async adminDonations() {
    return this.donationModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async refundContentPayment(paymentUuid: string, dto: any, user) {
    return this.contentService.refundPayment(paymentUuid, dto, user);
  }

  // async refundTripPayment(paymentUuid: string, dto: any) {
  //   return this.tripsService.refundPayment(paymentUuid, dto);
  // }

  async refundCoursePayment(paymentUuid: string, dto: any) {
    return this.coursesService.refundPayment(paymentUuid, dto);
  }

  async updateUser(uuid: string, dto: any) {
    const user = await this.userModel.findOne({ where: { uuid } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      first_name: dto.first_name ?? user.first_name,
      last_name: dto.last_name ?? user.last_name,
      phone: dto.phone ?? user.phone,
      gender: dto.gender ?? user.gender,
      country_code: dto.country_code ?? user.country_code,
      state_code: dto.state_code ?? user.state_code,
      city: dto.city ?? user.city,
      address_line_1: dto.address_line_1 ?? user.address_line_1,
      address_line_2: dto.address_line_2 ?? user.address_line_2,
      landmark: dto.landmark ?? user.landmark,
      postal_code: dto.postal_code ?? user.postal_code,
      is_active: dto.is_active ?? user.is_active,
      is_verified_devotee: dto.is_verified_devotee ?? user.is_verified_devotee,
    });

    return {
      message: 'User updated successfully',
      user: this.cleanUser(user),
    };
  }

  async updateEventStatus(uuid: string, status: any) {
    const allowed = ['draft', 'published', 'cancelled', 'completed'];

    if (!allowed.includes(status)) {
      throw new BadRequestException('Invalid event status');
    }

    const event = await this.eventModel.findOne({ where: { uuid } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await event.update({ status });

    return {
      message: 'Event status updated successfully',
      event,
    };
  }

  async deleteEvent(uuid: string) {
    const event = await this.eventModel.findOne({ where: { uuid } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await event.destroy();

    return {
      message: 'Event deleted successfully',
    };
  }

  async updateTripStatus(uuid: string, status: any) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await trip.update({ status });

    return {
      message: 'Trip status updated successfully',
    };
  }

  async deleteTrip(uuid: string) {
    const trip = await this.tripModel.findOne({
      where: { uuid },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await trip.destroy();

    return {
      message: 'Trip deleted successfully',
    };
  }
}
