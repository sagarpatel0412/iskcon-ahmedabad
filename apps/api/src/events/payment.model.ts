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

import { User } from '../users/user.model';
import { Centre } from '../centres/centre.model';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => Centre)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare centre_id: number | null;

  @BelongsTo(() => Centre)
  declare centre?: Centre;

  @Column({
    type: DataType.ENUM(
      'event',
      'journal',
      'newsletter',
      'course',
      'subscription',
      'donation',
    ),
    allowNull: false,
  })
  declare payable_type:
    | 'event'
    | 'journal'
    | 'newsletter'
    | 'course'
    | 'subscription'
    | 'donation';

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare payable_id: number;

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
  declare upi_reference_id: string | null;

  @Column({
    type: DataType.ENUM(
      'created',
      'pending',
      'paid',
      'failed',
      'refunded',
      'cancelled',
    ),
    defaultValue: 'created',
  })
  declare status: CreationOptional<
    'created' | 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  >;

  @Column({ type: DataType.DATE, allowNull: true })
  declare paid_at: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare failed_reason: string | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare raw_response: any;
}