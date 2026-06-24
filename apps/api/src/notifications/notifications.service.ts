import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

import { EmailTemplate } from './models/email-template.model';
import { EmailLog } from './models/email-log.model';

@Injectable()
export class NotificationsService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  constructor(
    @InjectModel(EmailTemplate)
    private readonly emailTemplateModel: typeof EmailTemplate,

    @InjectModel(EmailLog)
    private readonly emailLogModel: typeof EmailLog,
  ) {}

  private replaceVariables(content: string, variables: Record<string, any>) {
    let output = content;

    Object.keys(variables || {}).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      output = output.replace(regex, String(variables[key] ?? ''));
    });

    return output;
  }

  private wrapHtml(content: string) {
    return `
      <div style="margin:0;padding:0;background:#fdfaf5;font-family:Arial,sans-serif;">
        <div style="max-width:640px;margin:0 auto;padding:24px;">
          <div style="background:#ffffff;border:1px solid #ede0c8;border-radius:24px;padding:28px;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src="https://iskconahmedabad.com/images/logo.png" alt="ISKCON Ahmedabad" style="width:72px;height:72px;object-fit:contain;" />
              <h2 style="margin:12px 0 0;color:#1a0a00;">ISKCON Ahmedabad</h2>
            </div>

            ${content}

            <hr style="border:none;border-top:1px solid #ede0c8;margin:28px 0;" />

            <p style="font-size:12px;line-height:20px;color:#9a7a4a;text-align:center;">
              This is an automated message from ISKCON Ahmedabad.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private getFromAddress() {
    return (
      process.env.MAIL_FROM ||
      `"ISKCON Ahmedabad" <${process.env.MAIL_USER}>`
    );
  }

  async sendTemplateEmail(params: {
    to: string;
    templateKey: string;
    variables?: Record<string, any>;
  }) {
    const template = await this.emailTemplateModel.findOne({
      where: {
        template_key: params.templateKey,
        is_active: true,
      },
    });

    if (!template) {
      throw new NotFoundException(
        `Email template ${params.templateKey} not found`,
      );
    }

    const subject = this.replaceVariables(
      template.subject,
      params.variables || {},
    );

    const htmlBody = this.replaceVariables(
      template.html_body,
      params.variables || {},
    );

    const textBody = template.text_body
      ? this.replaceVariables(template.text_body, params.variables || {})
      : undefined;

    const log = await this.emailLogModel.create({
      uuid: uuidv4(),
      template_key: template.template_key,
      to_email: params.to,
      subject,
      provider: 'resend' as any,
      provider_message_id: null,
      status: 'pending',
      error_message: null,
      sent_at: null,
    });

    try {
      const result = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to: params.to,
        subject,
        html: this.wrapHtml(htmlBody),
        text: textBody,
      });

      await log.update({
        status: 'sent',
        provider_message_id: result.messageId || null,
        sent_at: new Date(),
      });

      return {
        message: 'Email sent successfully',
        provider_message_id: result.messageId,
      };
    } catch (error: any) {
      console.log('Email send failed:', error);

      await log.update({
        status: 'failed',
        error_message: error?.message || JSON.stringify(error),
      });

      throw error;
    }
  }

  async sendRawEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    const log = await this.emailLogModel.create({
      uuid: uuidv4(),
      template_key: null,
      to_email: params.to,
      subject: params.subject,
      provider: 'resend' as any,
      provider_message_id: null,
      status: 'pending',
      error_message: null,
      sent_at: null,
    });

    try {
      const result = await this.transporter.sendMail({
        from: this.getFromAddress(),
        to: params.to,
        subject: params.subject,
        html: this.wrapHtml(params.html),
        text: params.text,
      });

      await log.update({
        status: 'sent',
        provider_message_id: result.messageId || null,
        sent_at: new Date(),
      });

      return {
        message: 'Email sent successfully',
        provider_message_id: result.messageId,
      };
    } catch (error: any) {
      console.log('Email send failed:', error);

      await log.update({
        status: 'failed',
        error_message: error?.message || JSON.stringify(error),
      });

      throw error;
    }
  }
}