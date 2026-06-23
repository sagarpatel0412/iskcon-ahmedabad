import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { ShippingAddress } from './shipping-address.model';
import { ProductOrderItem } from './product-order-item.model';
import { ProductPayment } from './product-payment.model';
import { OrderStatusHistory } from './order-status-history.model';
import { ShopCoupon } from './shop-coupon.model';

@Table({
  tableName: 'product_orders',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductOrder extends Model<
  InferAttributes<ProductOrder>,
  InferCreationAttributes<ProductOrder>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => ShippingAddress)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare shipping_address_id: number | null;

  @ForeignKey(() => ShopCoupon)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare coupon_id: number | null;

  @BelongsTo(() => ShopCoupon)
  declare coupon?: ShopCoupon;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare coupon_code: string | null;

  @BelongsTo(() => ShippingAddress)
  declare shipping_address?: ShippingAddress;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare order_number: string;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  declare subtotal_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  declare shipping_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  declare discount_amount: CreationOptional<number>;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  declare total_amount: CreationOptional<number>;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
  })
  declare payment_status: CreationOptional<'pending' | 'success' | 'failed' | 'refunded'>;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  })
  declare order_status: CreationOptional<
    'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  >;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare razorpay_order_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare razorpay_payment_id: string | null;

  @HasMany(() => ProductOrderItem)
  declare items?: ProductOrderItem[];

  @HasMany(() => ProductPayment)
  declare payments?: ProductPayment[];

  @HasMany(() => OrderStatusHistory)
  declare status_history?: OrderStatusHistory[];

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare courier_name: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare tracking_number: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare tracking_url: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare shipped_at: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare delivered_at: Date | null;
}