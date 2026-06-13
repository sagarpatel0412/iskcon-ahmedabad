import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { User } from '../users/user.model';
import { DonationReceipt } from './donation-receipt.model';

@Table({
  tableName: 'donations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Donation extends Model<
  InferAttributes<Donation>,
  InferCreationAttributes<Donation>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare user_id: number | null;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare donor_name: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare donor_email: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare donor_phone: string | null;

  @Column({
    type: DataType.ENUM('nitya_seva', 'gau_seva', 'khichdi_seva'),
    allowNull: false,
  })
  declare seva_type: 'nitya_seva' | 'gau_seva' | 'khichdi_seva';

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('razorpay', 'cash', 'bank_transfer', 'upi'),
    defaultValue: 'razorpay',
  })
  declare payment_provider: CreationOptional<
    'razorpay' | 'cash' | 'bank_transfer' | 'upi'
  >;

  @Column({
    type: DataType.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
  })
  declare payment_status: CreationOptional<
    'pending' | 'success' | 'failed' | 'refunded'
  >;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare razorpay_order_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare razorpay_payment_id: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare razorpay_signature: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare transaction_reference: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_anonymous: CreationOptional<boolean>;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare paid_at: Date | null;

  @HasOne(() => DonationReceipt)
  declare receipt?: DonationReceipt;
}