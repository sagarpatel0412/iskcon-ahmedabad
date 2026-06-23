import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { ProductOrder } from './product-order.model';

@Table({
  tableName: 'order_status_history',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class OrderStatusHistory extends Model<
  InferAttributes<OrderStatusHistory>,
  InferCreationAttributes<OrderStatusHistory>
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
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare changed_by: number | null;

  @BelongsTo(() => User)
  declare changedBy?: User;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare old_status: string | null;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare new_status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string | null;
}