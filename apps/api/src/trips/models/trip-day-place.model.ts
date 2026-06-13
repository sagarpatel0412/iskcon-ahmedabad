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

import { TripDay } from './trip-day.model';

@Table({
  tableName: 'trip_day_places',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class TripDayPlace extends Model<
  InferAttributes<TripDayPlace>,
  InferCreationAttributes<TripDayPlace>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => TripDay)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare trip_day_id: number;

  @BelongsTo(() => TripDay)
  declare trip_day?: TripDay;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare place_name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TIME, allowNull: true })
  declare visit_time: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare location_url: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare image_url: string | null;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare sort_order: CreationOptional<number>;
}