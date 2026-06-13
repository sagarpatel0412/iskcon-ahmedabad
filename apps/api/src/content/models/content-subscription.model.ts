import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { User } from '../../users/user.model';
import { ContentPayment } from './content-payment.model';

@Table({
  tableName: 'content_subscriptions',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentSubscription extends Model<
  InferAttributes<ContentSubscription>,
  InferCreationAttributes<ContentSubscription>
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

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare plan_name: string;

  @Column({
    type: DataType.ENUM('monthly', 'yearly', 'lifetime'),
    allowNull: false,
    defaultValue: 'monthly',
  })
  declare plan_type: CreationOptional<'monthly' | 'yearly' | 'lifetime'>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare provider: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_subscription_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_payment_id: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare start_date: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare end_date: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare cancelled_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expired_at: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare cancel_reason: string | null;

  @Column({
    type: DataType.ENUM('active', 'expired', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: CreationOptional<
    'active' | 'expired' | 'cancelled' | 'refunded'
  >;

  @HasMany(() => ContentPayment)
  declare payments?: ContentPayment[];
}