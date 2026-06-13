import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

import { Donation } from './donation.model';
import { DonationReceipt } from './donation-receipt.model';
import { CreateDonationOrderDto } from './dto/create-donation-order.dto';
import { VerifyDonationPaymentDto } from './dto/verify-donation-payment.dto';

@Injectable()
export class DonationsService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Donation)
    private donationModel: typeof Donation,

    @InjectModel(DonationReceipt)
    private donationReceiptModel: typeof DonationReceipt,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(dto: CreateDonationOrderDto, user: any) {
    const amount = Number(dto.amount);

    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid donation amount');
    }

    const amountInPaise = Math.round(amount * 100);
    const currency = dto.currency || 'INR';

    const receipt = `DON-${Date.now()}`;

    const order = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        user_id: String(user.id),
        seva_type: dto.seva_type,
      },
    });

    const donation = await this.donationModel.create({
      uuid: uuidv4(),
      user_id: user.id,

      donor_name: dto.donor_name || user.first_name || null,
      donor_email: dto.donor_email || user.email || null,
      donor_phone: dto.donor_phone || user.phone || null,

      seva_type: dto.seva_type,
      amount,
      currency,

      payment_provider: 'razorpay',
      payment_status: 'pending',

      razorpay_order_id: order.id,

      is_anonymous: dto.is_anonymous ?? false,
      notes: dto.notes || null,
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      order,
      donation,
    };
  }

  async verifyPayment(dto: VerifyDonationPaymentDto, user: any) {
    const donation = await this.donationModel.findOne({
      where: {
        razorpay_order_id: dto.razorpay_order_id,
        user_id: user.id,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation order not found');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      await donation.update({
        payment_status: 'failed',
      });

      throw new BadRequestException('Invalid payment signature');
    }

    await donation.update({
      razorpay_payment_id: dto.razorpay_payment_id,
      razorpay_signature: dto.razorpay_signature,
      payment_status: 'success',
      paid_at: new Date(),
      transaction_reference: dto.razorpay_payment_id,
    });

    const receipt = await this.generateReceipt(donation);

    return {
      message: 'Donation successful',
      donation,
      receipt,
    };
  }

  async myDonations(user: any) {
    return this.donationModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: DonationReceipt,
          as: 'receipt',
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async generateReceipt(donation: Donation) {
    const existingReceipt = await this.donationReceiptModel.findOne({
      where: {
        donation_id: donation.id,
      },
    });

    if (existingReceipt) {
      return existingReceipt;
    }

    const receiptNumber = `ISKCON-AHD-${new Date().getFullYear()}-${String(
      donation.id,
    ).padStart(6, '0')}`;

    const uploadsDir = path.join(
      process.cwd(),
      'uploads',
      'donation-receipts',
    );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {
        recursive: true,
      });
    }

    const fileName = `${receiptNumber}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    const publicUrl = `/uploads/donation-receipts/${fileName}`;

    await this.createReceiptPdf({
      filePath,
      receiptNumber,
      donation,
    });

    const receipt = await this.donationReceiptModel.create({
      uuid: uuidv4(),
      donation_id: donation.id,
      receipt_number: receiptNumber,
      pdf_url: publicUrl,
      issued_at: new Date(),
    });

    return receipt;
  }

  async getReceiptPath(donationUuid: string, user: any) {
    const donation = await this.donationModel.findOne({
      where: {
        uuid: donationUuid,
        user_id: user.id,
        payment_status: 'success',
      },
      include: [
        {
          model: DonationReceipt,
          as: 'receipt',
        },
      ],
    });

    if (!donation || !donation.receipt?.pdf_url) {
      return null;
    }

    return path.join(process.cwd(), donation.receipt.pdf_url);
  }

  private createReceiptPdf({
    filePath,
    receiptNumber,
    donation,
  }: {
    filePath: string;
    receiptNumber: string;
    donation: Donation;
  }) {
    return new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc
        .fontSize(22)
        .text('ISKCON Ahmedabad', {
          align: 'center',
        });

      doc
        .moveDown(0.4)
        .fontSize(12)
        .text('Donation Receipt', {
          align: 'center',
        });

      doc
        .moveDown(0.4)
        .fontSize(10)
        .text('Om Namo Bhagavate Vasudevaya', {
          align: 'center',
        });

      doc.moveDown(2);

      doc.fontSize(12).text(`Receipt No: ${receiptNumber}`);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);

      doc.moveDown();

      doc.text(`Donor Name: ${donation.is_anonymous ? 'Anonymous' : donation.donor_name || '-'}`);
      doc.text(`Email: ${donation.donor_email || '-'}`);
      doc.text(`Phone: ${donation.donor_phone || '-'}`);

      doc.moveDown();

      doc.text(`Seva Type: ${this.formatSevaType(donation.seva_type)}`);
      doc.text(`Amount: ${donation.currency} ${donation.amount}`);
      doc.text(`Payment Status: ${donation.payment_status}`);
      doc.text(`Payment ID: ${donation.razorpay_payment_id || '-'}`);
      doc.text(`Order ID: ${donation.razorpay_order_id || '-'}`);

      doc.moveDown(2);

      doc
        .fontSize(11)
        .text(
          'Thank you for your generous contribution towards ISKCON Ahmedabad seva.',
          {
            align: 'center',
          },
        );

      doc
        .moveDown(0.5)
        .text('Hare Krishna Hare Krishna Krishna Krishna Hare Hare', {
          align: 'center',
        });

      doc.text('Hare Rama Hare Rama Rama Rama Hare Hare', {
        align: 'center',
      });

      doc.moveDown(2);

      doc
        .fontSize(9)
        .text(
          'This is a computer generated receipt.',
          {
            align: 'center',
          },
        );

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  }

  private formatSevaType(sevaType: string) {
    const map: Record<string, string> = {
      nitya_seva: 'Nitya Seva',
      gau_seva: 'Gau Seva',
      khichdi_seva: 'Khichdi Seva',
    };

    return map[sevaType] || sevaType;
  }
}