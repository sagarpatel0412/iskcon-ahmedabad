import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Centre } from '../../centres/centre.model';
import { User } from '../../users/user.model';
import { ProductCategory } from './product-category.model';
import { ProductImage } from './product-image.model';
import { ProductOrderItem } from './product-order-item.model';
import { Wishlist } from './wishlist.model';
import { CartItem } from './cart-item.model';
import { ProductInventoryLog } from './product-inventory-log.model';

@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Centre)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare centre_id: number | null;

  @BelongsTo(() => Centre)
  declare centre?: Centre;

  @ForeignKey(() => ProductCategory)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare category_id: number;

  @BelongsTo(() => ProductCategory)
  declare category?: ProductCategory;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare created_by: number;

  @BelongsTo(() => User, { as: 'creator', foreignKey: 'created_by' })
  declare creator?: User;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare sku: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 })
  declare price_amount: CreationOptional<number>;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare stock_quantity: CreationOptional<number>;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 5 })
  declare low_stock_alert: CreationOptional<number>;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare weight_grams: number | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_featured: CreationOptional<boolean>;

  @Column({
    type: DataType.ENUM('draft', 'published', 'out_of_stock', 'inactive'),
    defaultValue: 'draft',
  })
  declare status: CreationOptional<'draft' | 'published' | 'out_of_stock' | 'inactive'>;

  @HasMany(() => ProductImage)
  declare images?: ProductImage[];

  @HasMany(() => Wishlist)
  declare wishlists?: Wishlist[];

  @HasMany(() => CartItem)
  declare cart_items?: CartItem[];

  @HasMany(() => ProductOrderItem)
  declare order_items?: ProductOrderItem[];

  @HasMany(() => ProductInventoryLog)
  declare inventory_logs?: ProductInventoryLog[];
}