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

import { Course } from './course.model';

@Table({
  tableName: 'course_sessions',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CourseSession extends Model<
  InferAttributes<CourseSession>,
  InferCreationAttributes<CourseSession>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare course_id: number;

  @BelongsTo(() => Course)
  declare course?: Course;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare session_number: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare session_date: string;

  @Column({ type: DataType.TIME, allowNull: true })
  declare start_time: string | null;

  @Column({ type: DataType.TIME, allowNull: true })
  declare end_time: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare venue_name: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare venue_address: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare online_meeting_url: string | null;
}