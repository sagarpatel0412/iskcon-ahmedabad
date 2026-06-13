import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { ContactMessage } from './models/contact-message.model';
import { ProblemReport } from './models/problem-report.model';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { CreateProblemReportDto } from './dto/create-problem-report.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(ContactMessage)
    private readonly contactMessageModel: typeof ContactMessage,

    @InjectModel(ProblemReport)
    private readonly problemReportModel: typeof ProblemReport,
  ) {}

  async createContactMessage(dto: CreateContactMessageDto) {
    const message = await this.contactMessageModel.create({
      uuid: uuidv4(),
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone || null,
      subject: dto.subject || null,
      message: dto.message,
      status: 'new',
    });

    return {
      message: 'Contact message submitted successfully',
      data: message,
    };
  }

  async createProblemReport(dto: CreateProblemReportDto) {
    const report = await this.problemReportModel.create({
      uuid: uuidv4(),
      name: dto.name || null,
      email: dto.email || null,
      phone: dto.phone || null,
      problem_type: dto.problem_type || 'other',
      page_url: dto.page_url || null,
      title: dto.title,
      description: dto.description,
      priority: dto.priority || 'medium',
      status: 'new',
    });

    return {
      message: 'Problem report submitted successfully',
      data: report,
    };
  }

  async findContactMessages() {
    return this.contactMessageModel.findAll({
      order: [['id', 'DESC']],
    });
  }

  async findProblemReports() {
    return this.problemReportModel.findAll({
      order: [['id', 'DESC']],
    });
  }
}