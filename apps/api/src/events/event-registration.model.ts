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
import { User } from '../users/user.model';

@Table({
  tableName: 'event_registrations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class EventRegistration extends Model<
  InferAttributes<EventRegistration>,
  InferCreationAttributes<EventRegistration>
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
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare event_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare form_answers: any | null;

  @Column({
    type: DataType.CHAR(64),
    allowNull: false,
    unique: true,
  })
  declare qr_token: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare payment_id: number | null;

  @Column({
    type: DataType.ENUM(
      'registered',
      'cancelled',
      'attended',
      'rejected',
    ),
    defaultValue: 'registered',
  })
  declare status:
    | 'registered'
    | 'cancelled'
    | 'attended'
    | 'rejected';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare registered_at: CreationOptional<Date>;

  @BelongsTo(() => Event)
  declare event?: Event;

  @BelongsTo(() => User)
  declare user?: User;
}