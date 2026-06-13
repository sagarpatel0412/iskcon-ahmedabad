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
import { CoursePayment } from './course-payment.model';

@Table({
  tableName: 'course_registrations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CourseRegistration extends Model<
  InferAttributes<CourseRegistration>,
  InferCreationAttributes<CourseRegistration>
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

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => CoursePayment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare payment_id: number | null;

  @BelongsTo(() => CoursePayment)
  declare payment?: CoursePayment;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({
    type: DataType.ENUM('self', 'added_by_creator', 'admin_added'),
    defaultValue: 'self',
  })
  declare registration_source: CreationOptional<
    'self' | 'added_by_creator' | 'admin_added'
  >;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'cancelled', 'rejected'),
    defaultValue: 'pending',
  })
  declare registration_status: CreationOptional<
    'pending' | 'confirmed' | 'cancelled' | 'rejected'
  >;

  @Column({
    type: DataType.ENUM(
      'not_required',
      'pending',
      'success',
      'failed',
      'refunded',
    ),
    defaultValue: 'not_required',
  })
  declare payment_status: CreationOptional<
    'not_required' | 'pending' | 'success' | 'failed' | 'refunded'
  >;

  @Column({ type: DataType.DATE, allowNull: true })
  declare invite_email_sent_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare last_reminder_sent_at: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;
}