import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { ProductOrder } from './product-order.model';

@Table({
  tableName: 'product_payments',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductPayment extends Model<
  InferAttributes<ProductPayment>,
  InferCreationAttributes<ProductPayment>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => ProductOrder)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare order_id: number;

  @BelongsTo(() => ProductOrder)
  declare order?: ProductOrder;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({ type: DataType.ENUM('razorpay'), defaultValue: 'razorpay' })
  declare provider: CreationOptional<'razorpay'>;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_order_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_payment_id: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare provider_signature: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
  })
  declare status: CreationOptional<'pending' | 'success' | 'failed' | 'refunded'>;

  @Column({ type: DataType.JSON, allowNull: true })
  declare raw_response: any;
}