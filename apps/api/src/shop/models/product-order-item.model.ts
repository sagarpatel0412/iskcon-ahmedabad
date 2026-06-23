import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { ProductOrder } from './product-order.model';
import { Product } from './product.model';

@Table({
  tableName: 'product_order_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductOrderItem extends Model<
  InferAttributes<ProductOrderItem>,
  InferCreationAttributes<ProductOrderItem>
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

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare product_id: number | null;

  @BelongsTo(() => Product)
  declare product?: Product;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare product_title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare product_image_url: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price_amount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare total_amount: number;
}