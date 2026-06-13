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

import { Trip } from './trip.model';
import { TripDayPlace } from './trip-day-place.model';

@Table({
  tableName: 'trip_days',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class TripDay extends Model<
  InferAttributes<TripDay>,
  InferCreationAttributes<TripDay>
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

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare day_number: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare title: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare date: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare breakfast_info: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare lunch_info: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare dinner_info: string | null;

  @HasMany(() => TripDayPlace)
  declare places?: TripDayPlace[];
}