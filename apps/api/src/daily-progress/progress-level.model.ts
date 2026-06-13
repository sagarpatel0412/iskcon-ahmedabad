import { Table, Column, Model, DataType } from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({
  tableName: 'progress_levels',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProgressLevel extends Model<
  InferAttributes<ProgressLevel>,
  InferCreationAttributes<ProgressLevel>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare level_order: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare min_score: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare max_score: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare recommendation_text: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: CreationOptional<boolean>;
}