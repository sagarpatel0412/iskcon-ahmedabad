import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { CartItem } from './cart-item.model';

@Table({
  tableName: 'carts',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Cart extends Model<
  InferAttributes<Cart>,
  InferCreationAttributes<Cart>
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

  @HasMany(() => CartItem)
  declare items?: CartItem[];
}