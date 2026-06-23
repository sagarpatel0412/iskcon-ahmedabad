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
import { ProductOrder } from './product-order.model';
import { ShopCouponUsage } from './shop-coupon-usage.model';

@Table({
  tableName: 'shop_coupons',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ShopCoupon extends Model<
  InferAttributes<ShopCoupon>,
  InferCreationAttributes<ShopCoupon>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({
    type: DataType.ENUM('percentage', 'fixed'),
    allowNull: false,
  })
  declare discount_type: 'percentage' | 'fixed';

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare discount_value: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  declare min_order_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare max_discount_amount: number | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare usage_limit: number | null;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare used_count: CreationOptional<number>;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare per_user_limit: CreationOptional<number>;

  @Column({ type: DataType.DATE, allowNull: true })
  declare start_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare end_at: Date | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: CreationOptional<boolean>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare created_by: number | null;

  @BelongsTo(() => User, { as: 'creator', foreignKey: 'created_by' })
  declare creator?: User;

  @HasMany(() => ProductOrder)
  declare orders?: ProductOrder[];

  @HasMany(() => ShopCouponUsage)
  declare usages?: ShopCouponUsage[];
}