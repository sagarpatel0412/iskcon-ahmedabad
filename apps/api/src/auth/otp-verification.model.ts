// src/auth/otp-verification.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from '../users/user.model';

@Table({
  tableName: 'otp_verifications',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class OtpVerification extends Model<
  InferAttributes<OtpVerification>,
  InferCreationAttributes<OtpVerification>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare user_id: number | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare otp_hash: string;

  @Column({
    type: DataType.ENUM(
      'register',
      'login',
      'forgot_password',
      'verify_email',
      'verify_phone',
    ),
    allowNull: false,
  })
  declare purpose:
    | 'register'
    | 'login'
    | 'forgot_password'
    | 'verify_email'
    | 'verify_phone';

  @Column({ type: DataType.DATE, allowNull: false })
  declare expires_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare verified_at: Date | null;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare attempts: CreationOptional<number>;

  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  declare max_attempts: CreationOptional<number>;

  @BelongsTo(() => User)
  declare user?: User;
}