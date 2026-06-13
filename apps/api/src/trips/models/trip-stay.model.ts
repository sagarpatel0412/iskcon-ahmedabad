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

@Table({
  tableName: 'trip_stays',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class TripStay extends Model<
  InferAttributes<TripStay>,
  InferCreationAttributes<TripStay>
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

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare stay_name: string;

  @Column({
    type: DataType.ENUM('ashram', 'hotel', 'guest_house', 'dharamshala', 'other'),
    defaultValue: 'other',
  })
  declare stay_type: CreationOptional<
    'ashram' | 'hotel' | 'guest_house' | 'dharamshala' | 'other'
  >;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare address: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare check_in_date: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare check_out_date: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare contact_phone: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare location_url: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;
}