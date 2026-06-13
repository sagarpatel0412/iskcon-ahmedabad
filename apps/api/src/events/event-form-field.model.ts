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

@Table({
  tableName: 'event_form_fields',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class EventFormField extends Model<
  InferAttributes<EventFormField>,
  InferCreationAttributes<EventFormField>
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

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare label: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare field_key: string;

  @Column({
    type: DataType.ENUM(
      'text',
      'number',
      'email',
      'phone',
      'select',
      'checkbox',
      'textarea',
      'date',
    ),
    allowNull: false,
  })
  declare field_type:
    | 'text'
    | 'number'
    | 'email'
    | 'phone'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'date';

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare options: any | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_required: CreationOptional<boolean>;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare sort_order: CreationOptional<number>;

  @BelongsTo(() => Event)
  declare event?: Event;
}