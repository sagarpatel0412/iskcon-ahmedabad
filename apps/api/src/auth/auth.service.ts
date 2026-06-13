// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { User } from '../users/user.model';
import { Role } from '../roles/role.model';
import { UserRole } from '../roles/user-role.model';
import { Centre } from '../centres/centre.model';
import { AuthToken } from './auth-token.model';
import { OtpVerification } from './otp-verification.model';
import { MailService } from 'src/common/services/mail.service';
import { PasswordResetToken } from './password-reset-token.model';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Role)
    private readonly roleModel: typeof Role,

    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,

    @InjectModel(Centre)
    private readonly centreModel: typeof Centre,

    @InjectModel(AuthToken)
    private readonly authTokenModel: typeof AuthToken,

    @InjectModel(OtpVerification)
    private readonly otpVerificationModel: typeof OtpVerification,

    @InjectModel(PasswordResetToken)
    private readonly passwordResetTokenModel: typeof PasswordResetToken,

    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    if (dto.phone) {
      const existingPhone = await this.userModel.findOne({
        where: { phone: dto.phone },
      });

      if (existingPhone) {
        throw new BadRequestException('Phone already registered');
      }
    }

    const verifiedOtp = await this.otpVerificationModel.findOne({
      where: {
        email: dto.email,
        purpose: 'register',
      },
      order: [['id', 'DESC']],
    });

    if (!verifiedOtp || !verifiedOtp.verified_at) {
      throw new BadRequestException('Please verify OTP before registration');
    }

    if (dto.centre_id) {
      const centre = await this.centreModel.findByPk(dto.centre_id);

      if (!centre) {
        throw new BadRequestException('Invalid centre selected');
      }
    }

    const seekerRole = await this.roleModel.findOne({
      where: { name: 'SEEKER' },
    });

    if (!seekerRole) {
      throw new BadRequestException(
        'SEEKER role not found. Please seed roles first.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id ?? null,
      first_name: dto.first_name,
      last_name: dto.last_name ?? null,
      email: dto.email,
      phone: dto.phone ?? null,
      password_hash: passwordHash,
      country_code: dto.country_code ?? null,
      state_code: dto.state_code ?? null,
      city: dto.city ?? null,
      address_line_1: dto.address_line_1 ?? null,
      address_line_2: dto.address_line_2 ?? null,
      landmark: dto.landmark ?? null,
      postal_code: dto.postal_code ?? null,
    });

    await this.userRoleModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      role_id: seekerRole.id,
    });

    const { password_hash, ...safeUser } = user.get({ plain: true }) as any;

    return {
      message: 'User registered successfully',
      user: safeUser,
      role: 'SEEKER',
    };
  }

  async login(dto: LoginDto, req: Request) {
    const user = await this.userModel.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokenData = await this.createAuthToken(user, dto, req);
    const { password_hash, ...safeUser } = user.get({ plain: true }) as any;


    return {
      message: 'Login successful',
      ...tokenData,
      user: safeUser,
    };
  }

  async logout(authorization: string) {
    const rawToken = this.extractBearerToken(authorization);

    const activeTokens = await this.authTokenModel.findAll({
      where: { revoked_at: null },
    });

    for (const authToken of activeTokens) {
      const isMatch = await bcrypt.compare(rawToken, authToken.token_hash);

      if (isMatch) {
        await authToken.update({
          revoked_at: new Date(),
        });

        return {
          message: 'Logout successful',
        };
      }
    }

    throw new UnauthorizedException('Invalid token');
  }

  async sendOtp(dto: SendOtpDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    let userId: number | null = null;

    if (dto.email) {
      const user = await this.userModel.findOne({
        where: { email: dto.email },
      });

      if (dto.purpose === 'register' && user) {
        throw new BadRequestException('Email already registered');
      }

      if (dto.purpose === 'login') {
        if (!user) {
          throw new BadRequestException('User not found');
        }

        if (!user.is_active) {
          throw new BadRequestException('User account is inactive');
        }

        userId = user.id;
      }

      if (['forgot_password', 'verify_email'].includes(dto.purpose) && !user) {
        throw new BadRequestException('User not found');
      }

      if (['forgot_password', 'verify_email'].includes(dto.purpose) && user) {
        userId = user.id;
      }
    }

    const otp = this.generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpVerificationModel.create({
      uuid: uuidv4(),
      user_id: userId,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      otp_hash: otpHash,
      purpose: dto.purpose,
      expires_at: expiresAt,
      verified_at: null,
      attempts: 0,
      max_attempts: 5,
    });

    if (dto.email) {
      await this.mailService.sendOtpEmail(dto.email, otp);
    }

    // SMS later
    // if (dto.phone) {
    //   await this.smsService.sendOtpSms(dto.phone, otp);
    // }

    return {
      message: 'OTP sent successfully',
      expires_at: expiresAt,
    };
  }

  async verifyOtp(dto: VerifyOtpDto, req: Request) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const whereCondition: any = {
      purpose: dto.purpose,
      verified_at: null,
    };

    if (dto.email) {
      whereCondition.email = dto.email;
    }

    if (dto.phone) {
      whereCondition.phone = dto.phone;
    }

    const otpRecord = await this.otpVerificationModel.findOne({
      where: whereCondition,
      order: [['id', 'DESC']],
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.attempts >= otpRecord.max_attempts) {
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otp_hash);

    await otpRecord.update({
      attempts: otpRecord.attempts + 1,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    await otpRecord.update({
      verified_at: new Date(),
    });

    if (dto.purpose === 'login') {
      const user = await this.userModel.findOne({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokenData = await this.createAuthToken(
        user,
        {
          email: user.email,
          password: '',
          device_type: 'android',
          device_name: 'OTP Login',
        } as LoginDto,
        req,
      );

      const { password_hash, ...safeUser } = user.get({ plain: true }) as any;

      return {
        message: 'OTP login successful',
        ...tokenData,
        user: safeUser,
      };
    }

    return {
      message: 'OTP verified successfully',
    };
  }

  private async createAuthToken(user: User, dto: LoginDto, req: Request) {
    const rawToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.authTokenModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      token_hash: tokenHash,
      device_type: dto.device_type ?? null,
      device_name: dto.device_name ?? null,
      ip_address: req.ip ?? null,
      user_agent: req.headers['user-agent']?.toString() ?? null,
      expires_at: expiresAt,
    });

    return {
      token: rawToken,
      token_type: 'Bearer',
      expires_at: expiresAt,
    };
  }

  private extractBearerToken(authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return token;
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });

    // Do not reveal if email exists or not
    if (!user) {
      return {
        message: 'If this email exists, a reset link has been sent.',
      };
    }

    await this.passwordResetTokenModel.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          user_id: user.id,
          used_at: null,
        },
      },
    );

    const rawToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetTokenModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used_at: null,
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    await this.mailService.transporter.sendMail({
      to: user.email,
      subject: 'Reset your Krishna App password',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hare Krishna ${user.first_name || ''}</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password. This link is valid for 15 minutes.</p>
        <p>
          <a href="${resetLink}"
             style="background:#c8902a;color:#1a0a00;padding:12px 18px;text-decoration:none;border-radius:10px;font-weight:bold;">
             Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Hare Krishna 🙏</p>
      </div>
    `,
    });

    return {
      message: 'If this email exists, a reset link has been sent.',
    };
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.passwordResetTokenModel.findOne({
      where: {
        token_hash: tokenHash,
        used_at: null,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Reset link is invalid or expired');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.userModel.update(
      {
        password_hash: passwordHash,
      },
      {
        where: {
          id: resetToken.user_id,
        },
      },
    );

    await resetToken.update({
      used_at: new Date(),
    });

    return {
      message: 'Password reset successfully',
    };
  }
}
