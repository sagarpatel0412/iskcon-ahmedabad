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

import { User } from '../../users/user.model';
import { ContentSubscription } from './content-subscription.model';
import { ContentPost } from './content-post.model';
import { ContentSubscriptionPlan } from './content-subscription-plan.model';

@Table({
  tableName: 'content_payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentPayment extends Model<
  InferAttributes<ContentPayment>,
  InferCreationAttributes<ContentPayment>
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

  @ForeignKey(() => ContentSubscription)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare subscription_id: number | null;

  @BelongsTo(() => ContentSubscription)
  declare subscription?: ContentSubscription;

  @ForeignKey(() => ContentSubscriptionPlan)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare subscription_plan_id: number | null;

  @BelongsTo(() => ContentSubscriptionPlan)
  declare subscription_plans?: ContentSubscriptionPlan;

  @ForeignKey(() => ContentPost)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare post_id: number | null;

  @BelongsTo(() => ContentPost)
  declare post?: ContentPost;

  @Column({
    type: DataType.ENUM('one_time', 'subscription'),
    allowNull: false,
    defaultValue: 'one_time',
  })
  declare payment_type: CreationOptional<'one_time' | 'subscription'>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('razorpay', 'cashfree', 'manual_upi'),
    allowNull: false,
    defaultValue: 'razorpay',
  })
  declare provider: CreationOptional<'razorpay' | 'cashfree' | 'manual_upi'>;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_order_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_payment_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_refund_id: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare provider_signature: string | null;

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
    allowNull: false,
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
  declare refund_reason: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare failed_reason: string | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare raw_response: any;
}