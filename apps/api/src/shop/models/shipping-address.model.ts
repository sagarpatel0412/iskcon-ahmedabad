import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { User } from '../../users/user.model';
import { ProductOrder } from './product-order.model';

@Table({
  tableName: 'shipping_addresses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ShippingAddress extends Model<
  InferAttributes<ShippingAddress>,
  InferCreationAttributes<ShippingAddress>
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

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare address_line_1: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare address_line_2: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare landmark: string | null;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare city: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare state_code: string | null;

  @Column({ type: DataType.STRING(20), defaultValue: 'IN' })
  declare country_code: CreationOptional<string>;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare postal_code: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_default: CreationOptional<boolean>;

  @HasMany(() => ProductOrder)
  declare orders?: ProductOrder[];
}