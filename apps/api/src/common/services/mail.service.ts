import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  public transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendOtpEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Your ISKCON Ahmedabad OTP',
      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Hare Krishna 🙏</h2>

          <p>Your OTP is:</p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            color:#c2410c;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>This OTP expires in 5 minutes.</p>

          <p>ISKCON Ahmedabad</p>
        </div>
      `,
    });
  }
}