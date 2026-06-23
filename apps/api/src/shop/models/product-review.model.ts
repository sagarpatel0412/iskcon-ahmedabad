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

import { Product } from './product.model';
import { ProductOrder } from './product-order.model';
import { User } from '../../users/user.model';

@Table({
  tableName: 'product_reviews',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductReview extends Model<
  InferAttributes<ProductReview>,
  InferCreationAttributes<ProductReview>
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

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => ProductOrder)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare order_id: number | null;

  @BelongsTo(() => ProductOrder)
  declare order?: ProductOrder;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare rating: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare review_text: string | null;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved',
  })
  declare status: CreationOptional<'pending' | 'approved' | 'rejected'>;
}