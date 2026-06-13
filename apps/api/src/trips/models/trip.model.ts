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
import { Centre } from '../../centres/centre.model';
import { TripDay } from './trip-day.model';
import { TripStay } from './trip-stay.model';
import { TripRegistration } from './trip-registration.model';
import { TripPayment } from './trip-payment.model';

@Table({
  tableName: 'trips',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Trip extends Model<
  InferAttributes<Trip>,
  InferCreationAttributes<Trip>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Centre)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare centre_id: number | null;

  @BelongsTo(() => Centre)
  declare centre?: Centre;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare created_by: number;

  @BelongsTo(() => User, 'created_by')
  declare creator?: User;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(255), allowNull: true, unique: true })
  declare slug: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare cover_image_url: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare start_date: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare end_date: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare departure_city: string | null;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare destination: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare meeting_point: string | null;

  @Column({ type: DataType.TIME, allowNull: true })
  declare meeting_time: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare price_amount: CreationOptional<number>;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_paid: CreationOptional<boolean>;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare max_capacity: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare registration_start_date: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare registration_end_date: Date | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare includes: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare excludes: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare rules: string | null;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare contact_name: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare contact_phone: string | null;

  @Column({
    type: DataType.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'draft',
  })
  declare status: CreationOptional<
    'draft' | 'published' | 'cancelled' | 'completed'
  >;

  @HasMany(() => TripDay)
  declare days?: TripDay[];

  @HasMany(() => TripStay)
  declare stays?: TripStay[];

  @HasMany(() => TripRegistration)
  declare registrations?: TripRegistration[];

  @HasMany(() => TripPayment)
  declare payments?: TripPayment[];
}