import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { Product } from './product.model';

@Table({
  tableName: 'product_inventory_logs',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductInventoryLog extends Model<
  InferAttributes<ProductInventoryLog>,
  InferCreationAttributes<ProductInventoryLog>
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
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare changed_by: number | null;

  @BelongsTo(() => User)
  declare changedBy?: User;

  @Column({
    type: DataType.ENUM('add', 'remove', 'sale', 'cancel_return', 'manual_adjustment'),
    allowNull: false,
  })
  declare change_type:
    | 'add'
    | 'remove'
    | 'sale'
    | 'cancel_return'
    | 'manual_adjustment';

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity_change: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare previous_quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare new_quantity: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string | null;
}