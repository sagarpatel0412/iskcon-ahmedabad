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

import { User } from '../../users/user.model';
import { ProductOrder } from './product-order.model';
import { ShopCoupon } from './shop-coupon.model';

@Table({
  tableName: 'shop_coupon_usages',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ShopCouponUsage extends Model<
  InferAttributes<ShopCouponUsage>,
  InferCreationAttributes<ShopCouponUsage>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => ShopCoupon)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare coupon_id: number;

  @BelongsTo(() => ShopCoupon)
  declare coupon?: ShopCoupon;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => ProductOrder)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare order_id: number;

  @BelongsTo(() => ProductOrder)
  declare order?: ProductOrder;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare discount_amount: number;
}