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

import { User } from '../users/user.model';

@Table({
  tableName: 'promotional_banners',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class PromotionalBanner extends Model<
  InferAttributes<PromotionalBanner>,
  InferCreationAttributes<PromotionalBanner>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare subtitle: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare image_url: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare button_text: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare redirect_url: string | null;

  @Column({
    type: DataType.ENUM('event', 'trip', 'course', 'product', 'custom'),
    defaultValue: 'custom',
  })
  declare banner_type: CreationOptional<
    'event' | 'trip' | 'course' | 'product' | 'custom'
  >;

  @Column({ type: DataType.CHAR(36), allowNull: true })
  declare reference_uuid: string | null;

  @Column({
    type: DataType.ENUM('modal', 'banner', 'both'),
    defaultValue: 'modal',
  })
  declare display_type: CreationOptional<'modal' | 'banner' | 'both'>;

  @Column({
    type: DataType.ENUM('home', 'shop', 'events', 'trips', 'courses', 'all'),
    defaultValue: 'all',
  })
  declare position: CreationOptional<
    'home' | 'shop' | 'events' | 'trips' | 'courses' | 'all'
  >;

  @Column({ type: DataType.DATE, allowNull: true })
  declare start_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare end_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare auto_remove_at: Date | null;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare priority: CreationOptional<number>;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: CreationOptional<boolean>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare created_by: number | null;

  @BelongsTo(() => User, { as: 'creator', foreignKey: 'created_by' })
  declare creator?: User;
}