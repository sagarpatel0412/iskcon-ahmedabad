import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Event } from './event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Centre } from '../centres/centre.model';
import { User } from '../users/user.model';
import { EventFormField } from './event-form-field.model';
import { CreateEventFormFieldDto } from './dto/create-event-form-field.dto';
import { EventRegistration } from './event-registration.model';
import * as crypto from 'crypto';
import { RegisterEventDto } from './dto/register-event.dto';
import { EventAttendance } from './event-attendance.model';
import { ScanEventQrDto } from './dto/scan-event-qr.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(Centre)
    private readonly centreModel: typeof Centre,

    @InjectModel(EventFormField)
    private readonly eventFormFieldModel: typeof EventFormField,

    @InjectModel(EventRegistration)
    private readonly eventRegistrationModel: typeof EventRegistration,

    @InjectModel(EventAttendance)
    private readonly eventAttendanceModel: typeof EventAttendance,
  ) { }

  async create(dto: CreateEventDto, user: User) {
    const centre = await this.centreModel.findByPk(dto.centre_id);

    if (!centre) {
      throw new NotFoundException('Centre not found');
    }

    const event = await this.eventModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id,
      created_by: user.id,
      title: dto.title,
      description: dto.description ?? null,
      poster_url: dto.poster_url ?? null,
      location: dto.location ?? null,
      event_date: dto.event_date,
      start_time: dto.start_time ?? null,
      end_time: dto.end_time ?? null,
      registration_start_at: dto.registration_start_at
        ? new Date(dto.registration_start_at)
        : null,
      registration_end_at: dto.registration_end_at
        ? new Date(dto.registration_end_at)
        : null,
      max_capacity: dto.max_capacity ?? null,
      is_paid: dto.is_paid ?? false,
      price_amount: dto.price_amount ?? 0,
      currency: 'INR',
      status: dto.status ?? 'draft',
    });

    return {
      message: 'Event created successfully',
      event,
    };
  }

  async findAll() {
    return this.eventModel.findAll({
      include: [
        { model: Centre },
        { model: User, as: 'creator' },
      ],
      order: [['event_date', 'ASC']],
    });
  }

  async findOne(uuid: string) {
    const event = await this.eventModel.findOne({
      where: { uuid },
      include: [
        { model: Centre },
        { model: User, as: 'creator' },
        { model: EventFormField },
      ],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(uuid: string, dto: UpdateEventDto, user: User) {
    const event = await this.findOne(uuid);

    const isCreator = event.created_by === user.id;
    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException('Only event creator or admin can update this event');
    }

    await event.update({
      centre_id: dto.centre_id ?? event.centre_id,
      title: dto.title ?? event.title,
      description: dto.description ?? event.description,
      poster_url: dto.poster_url ?? event.poster_url,
      location: dto.location ?? event.location,
      event_date: dto.event_date ?? event.event_date,
      start_time: dto.start_time ?? event.start_time,
      end_time: dto.end_time ?? event.end_time,
      registration_start_at: dto.registration_start_at
        ? new Date(dto.registration_start_at)
        : event.registration_start_at,
      registration_end_at: dto.registration_end_at
        ? new Date(dto.registration_end_at)
        : event.registration_end_at,
      max_capacity: dto.max_capacity ?? event.max_capacity,
      is_paid: dto.is_paid ?? event.is_paid,
      price_amount: dto.price_amount ?? event.price_amount,
      status: dto.status ?? event.status,
    });

    return {
      message: 'Event updated successfully',
      event,
    };
  }

  async remove(uuid: string, user: User) {
    const event = await this.findOne(uuid);

    const isCreator = event.created_by === user.id;
    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException('Only event creator or admin can delete this event');
    }

    await event.destroy();

    return {
      message: 'Event deleted successfully',
    };
  }

  async addFormField(
    eventUuid: string,
    dto: CreateEventFormFieldDto,
    user: User,
  ) {
    
    const event = await this.findOne(eventUuid);

    const isCreator = event.created_by === user.id;
    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'Only event creator or admin can add form fields',
      );
    }

    const field = await this.eventFormFieldModel.create({
      uuid: uuidv4(),
      event_id: event.id,
      label: dto.label,
      field_key: dto.field_key,
      field_type: dto.field_type,
      options: dto.options ?? null,
      is_required: dto.is_required ?? false,
      sort_order: dto.sort_order ?? 0,
    });

    return {
      message: 'Form field added successfully',
      field,
    };
  }

  async getFormFields(eventUuid: string) {
    const event = await this.findOne(eventUuid);

    return this.eventFormFieldModel.findAll({
      where: {
        event_id: event.id,
      },
      order: [['sort_order', 'ASC']],
    });
  }

  async registerForEvent(
    eventUuid: string,
    dto: RegisterEventDto,
    user: User,
  ) {
    const event = await this.findOne(eventUuid);

    if (event.status !== 'published') {
      throw new BadRequestException('Event is not open for registration');
    }

    if (event.registration_start_at && event.registration_start_at > new Date()) {
      throw new BadRequestException('Registration has not started yet');
    }

    if (event.registration_end_at && event.registration_end_at < new Date()) {
      throw new BadRequestException('Registration is closed');
    }

    if (event.is_paid) {
      throw new BadRequestException(
        'This is a paid event. Please complete payment first.',
      );
    }

    const existingRegistration = await this.eventRegistrationModel.findOne({
      where: {
        event_id: event.id,
        user_id: user.id,
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('You are already registered for this event');
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

    const qrToken = crypto.randomBytes(32).toString('hex');

    const registration = await this.eventRegistrationModel.create({
      uuid: uuidv4(),
      event_id: event.id,
      user_id: user.id,
      form_answers: dto.form_answers ?? null,
      qr_token: qrToken,
      payment_id: null,
      status: 'registered',
      registered_at: new Date(),
    });

    return {
      message: 'Event registered successfully',
      registration_uuid: registration.uuid,
      qr_token: qrToken,
      qr_payload: {
        type: 'event_attendance',
        event_uuid: event.uuid,
        registration_uuid: registration.uuid,
        qr_token: qrToken,
      },
    };
  }

  async scanQr(dto: ScanEventQrDto, scanner: User) {
    const registration = await this.eventRegistrationModel.findOne({
      where: {
        qr_token: dto.qr_token,
        status: 'registered',
      },
      include: [
        { model: Event },
        { model: User },
      ],
    });

    if (!registration) {
      throw new BadRequestException('Invalid QR or already used');
    }

    const event = registration.event;

    if (!event) {
      throw new BadRequestException('Event not found for registration');
    }

    if (event.status !== 'published') {
      throw new BadRequestException('Event is not active');
    }

    const existingAttendance = await this.eventAttendanceModel.findOne({
      where: {
        registration_id: registration.id,
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Attendance already marked');
    }

    const attendance = await this.eventAttendanceModel.create({
      uuid: uuidv4(),
      event_id: registration.event_id,
      registration_id: registration.id,
      user_id: registration.user_id,
      scanned_by: scanner.id,
      scanned_at: new Date(),
      status: 'approved',
    });

    await registration.update({
      status: 'attended',
    });

    return {
      message: 'Attendance marked successfully',
      attendance_uuid: attendance.uuid,
      seeker: registration.user,
      event,
    };
  }

  async uploadPoster(
    eventUuid: string,
    file: Express.Multer.File,
    user: User,
  ) {
    const event = await this.findOne(eventUuid);

    const isCreator = event.created_by === user.id;
    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'Only event creator or admin can upload poster',
      );
    }

    const posterUrl = `/uploads/events/${file.filename}`;

    await event.update({
      poster_url: posterUrl,
    });

    return {
      message: 'Poster uploaded successfully',
      poster_url: posterUrl,
      event,
    };
  }

  async myRegistrations(user: User) {
    return this.eventRegistrationModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Event,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async eventRegistrations(eventUuid: string, user: User) {
    const event = await this.findOne(eventUuid);

    const isCreator = event.created_by === user.id;
    const isAdmin =
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

    if (!isCreator && !isAdmin) {
      throw new ForbiddenException(
        'Only event creator or admin can view registrations',
      );
    }

    return this.eventRegistrationModel.findAll({
      where: {
        event_id: event.id,
      },
      include: [
        {
          model: User,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  private isEventCreatorOrAdmin(event: Event, user: User) {
  const isCreator = event.created_by === user.id;

  const isAdmin =
    user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false;

  return isCreator || isAdmin;
}

async myEvents(user: User) {
  return this.eventModel.findAll({
    where: {
      created_by: user.id,
    },
    include: [
      { model: Centre },
      { model: User, as: 'creator' },
      { model: EventFormField },
    ],
    order: [['id', 'DESC']],
  });
}

async addFormFieldsBulk(
  eventUuid: string,
  fields: CreateEventFormFieldDto[],
  user: User,
) {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new BadRequestException('Fields array is required');
  }

  const event = await this.findOne(eventUuid);

  if (!this.isEventCreatorOrAdmin(event, user)) {
    throw new ForbiddenException(
      'Only event creator or admin can add form fields',
    );
  }

  const createdFields: any[] = [];

  for (const [index, fieldDto] of fields.entries()) {
    const field:any = await this.eventFormFieldModel.create({
      uuid: uuidv4(),
      event_id: event.id,
      label: fieldDto.label,
      field_key: fieldDto.field_key,
      field_type: fieldDto.field_type,
      options: fieldDto.options ?? null,
      is_required: fieldDto.is_required ?? false,
      sort_order: fieldDto.sort_order ?? index + 1,
    });

    createdFields.push(field);
  }

  return {
    message: 'Form fields added successfully',
    fields: createdFields,
  };
}

async updateFormField(
  fieldUuid: string,
  dto: CreateEventFormFieldDto,
  user: User,
) {
  const field = await this.eventFormFieldModel.findOne({
    where: {
      uuid: fieldUuid,
    },
    include: [{ model: Event }],
  });

  if (!field) {
    throw new NotFoundException('Form field not found');
  }

  const event = field.event;

  if (!event) {
    throw new NotFoundException('Event not found for this form field');
  }

  if (!this.isEventCreatorOrAdmin(event, user)) {
    throw new ForbiddenException(
      'Only event creator or admin can update form field',
    );
  }

  await field.update({
    label: dto.label,
    field_key: dto.field_key,
    field_type: dto.field_type,
    options: dto.options ?? field.options,
    is_required: dto.is_required ?? field.is_required,
    sort_order: dto.sort_order ?? field.sort_order,
  });

  return {
    message: 'Form field updated successfully',
    field,
  };
}

async deleteFormField(fieldUuid: string, user: User) {
  const field = await this.eventFormFieldModel.findOne({
    where: {
      uuid: fieldUuid,
    },
    include: [{ model: Event }],
  });

  if (!field) {
    throw new NotFoundException('Form field not found');
  }

  const event = field.event;

  if (!event) {
    throw new NotFoundException('Event not found for this form field');
  }

  if (!this.isEventCreatorOrAdmin(event, user)) {
    throw new ForbiddenException(
      'Only event creator or admin can delete form field',
    );
  }

  await field.destroy();

  return {
    message: 'Form field deleted successfully',
  };
}

async registerPaidEventAfterPayment(
  eventUuid: string,
  dto: {
    form_answers?: Record<string, any> | null;
    payment_id: number;
  },
  user: User,
) {
  const event = await this.findOne(eventUuid);

  if (event.status !== 'published') {
    throw new BadRequestException('Event is not open for registration');
  }

  if (!event.is_paid) {
    throw new BadRequestException('This event does not require payment');
  }

  if (event.registration_start_at && event.registration_start_at > new Date()) {
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
    throw new BadRequestException('You are already registered for this event');
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

  const qrToken = crypto.randomBytes(32).toString('hex');

  const registration = await this.eventRegistrationModel.create({
    uuid: uuidv4(),
    event_id: event.id,
    user_id: user.id,
    form_answers: dto.form_answers ?? null,
    qr_token: qrToken,
    payment_id: dto.payment_id,
    status: 'registered',
    registered_at: new Date(),
  });

  return {
    message: 'Paid event registered successfully',
    registration_uuid: registration.uuid,
    qr_token: qrToken,
    qr_payload: {
      type: 'event_attendance',
      event_uuid: event.uuid,
      registration_uuid: registration.uuid,
      qr_token: qrToken,
    },
  };
}
}