import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Product } from './product.model';

@Table({
  tableName: 'product_images',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductImage extends Model<
  InferAttributes<ProductImage>,
  InferCreationAttributes<ProductImage>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare product_id: number;

  @BelongsTo(() => Product)
  declare product?: Product;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare image_url: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare sort_order: CreationOptional<number>;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_primary: CreationOptional<boolean>;
}