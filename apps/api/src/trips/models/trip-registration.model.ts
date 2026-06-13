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

import { Trip } from './trip.model';
import { User } from '../../users/user.model';
import { TripPayment } from './trip-payment.model';

@Table({
  tableName: 'trip_registrations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class TripRegistration extends Model<
  InferAttributes<TripRegistration>,
  InferCreationAttributes<TripRegistration>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Trip)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare trip_id: number;

  @BelongsTo(() => Trip)
  declare trip?: Trip;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => TripPayment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare payment_id: number | null;

  @BelongsTo(() => TripPayment)
  declare payment?: TripPayment;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age: number | null;

  @Column({ type: DataType.ENUM('male', 'female', 'other'), allowNull: true })
  declare gender: 'male' | 'female' | 'other' | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare emergency_contact_name: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare emergency_contact_phone: string | null;

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

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;
}