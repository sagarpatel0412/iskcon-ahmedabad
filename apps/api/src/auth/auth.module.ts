import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Role } from 'src/roles/role.model';
import { UserRole } from 'src/roles/user-role.model';
import { Centre } from 'src/centres/centre.model';
import { AuthToken } from './auth-token.model';
import { OtpVerification } from './otp-verification.model';
import { MailService } from 'src/common/services/mail.service';
import { PasswordResetToken } from './password-reset-token.model';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [SequelizeModule.forFeature([
    User,
    Role,
    UserRole,
    Centre,
    AuthToken,
    OtpVerification,
    PasswordResetToken
  ]), NotificationsModule],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService],
})
export class AuthModule { }
