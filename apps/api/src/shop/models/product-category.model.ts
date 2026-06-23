import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Centre } from '../../centres/centre.model';
import { Product } from './product.model';

@Table({
  tableName: 'product_categories',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProductCategory extends Model<
  InferAttributes<ProductCategory>,
  InferCreationAttributes<ProductCategory>
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

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(180), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare image_url: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: CreationOptional<boolean>;

  @HasMany(() => Product)
  declare products?: Product[];
}