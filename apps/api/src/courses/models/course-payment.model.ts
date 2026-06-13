import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Course } from './course.model';
import { User } from '../../users/user.model';
import { CourseRegistration } from './course-registration.model';

@Table({
  tableName: 'course_payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CoursePayment extends Model<
  InferAttributes<CoursePayment>,
  InferCreationAttributes<CoursePayment>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare course_id: number;

  @BelongsTo(() => Course)
  declare course?: Course;

  @ForeignKey(() => CourseRegistration)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare registration_id: number | null;

  @BelongsTo(() => CourseRegistration)
  declare registration?: CourseRegistration;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('razorpay', 'cashfree', 'manual_upi'),
    defaultValue: 'razorpay',
  })
  declare provider: CreationOptional<'razorpay' | 'cashfree' | 'manual_upi'>;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_order_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_payment_id: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare provider_signature: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_refund_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare transaction_id: string | null;

  @Column({
    type: DataType.ENUM(
      'pending',
      'success',
      'failed',
      'refund_pending',
      'refunded',
      'refund_failed',
    ),
    defaultValue: 'pending',
  })
  declare payment_status: CreationOptional<
    | 'pending'
    | 'success'
    | 'failed'
    | 'refund_pending'
    | 'refunded'
    | 'refund_failed'
  >;

  @Column({ type: DataType.DATE, allowNull: true })
  declare paid_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare refunded_at: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare failed_reason: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare refund_reason: string | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare raw_response: any;
}