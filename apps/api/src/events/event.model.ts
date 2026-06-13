// src/events/event.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { User } from '../users/user.model';
import { Centre } from '../centres/centre.model';
import { EventFormField } from './event-form-field.model';

@Table({
  tableName: 'events',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
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

  @ForeignKey(() => Centre)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare centre_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare created_by: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare poster_url: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare location: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare event_date: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare start_time: string | null;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare end_time: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare registration_start_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare registration_end_at: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare max_capacity: number | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_paid: CreationOptional<boolean>;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  declare price_amount: CreationOptional<number>;

  @Column({
    type: DataType.STRING(10),
    defaultValue: 'INR',
  })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM(
      'draft',
      'published',
      'cancelled',
      'completed',
    ),
    defaultValue: 'draft',
  })
  declare status:
    | 'draft'
    | 'published'
    | 'cancelled'
    | 'completed';

  @BelongsTo(() => User)
  declare creator?: User;

  @BelongsTo(() => Centre)
  declare centre?: Centre;

  @HasMany(() => EventFormField)
  declare form_fields?: EventFormField[];
}