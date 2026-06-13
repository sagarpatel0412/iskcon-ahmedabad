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

import { Event } from './event.model';
import { EventRegistration } from './event-registration.model';
import { User } from '../users/user.model';

@Table({
  tableName: 'event_attendance',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class EventAttendance extends Model<
  InferAttributes<EventAttendance>,
  InferCreationAttributes<EventAttendance>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
    unique: true,
  })
  declare uuid: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare event_id: number;

  @ForeignKey(() => EventRegistration)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare registration_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare scanned_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare scanned_at: CreationOptional<Date>;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
  })
  declare status: 'pending' | 'approved' | 'rejected';

  @BelongsTo(() => Event)
  declare event?: Event;

  @BelongsTo(() => EventRegistration)
  declare registration?: EventRegistration;

  @BelongsTo(() => User, 'user_id')
  declare user?: User;

  @BelongsTo(() => User, 'scanned_by')
  declare scanner?: User;
}