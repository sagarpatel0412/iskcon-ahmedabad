import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { ContentPayment } from './content-payment.model';

@Table({
  tableName: 'content_subscription_plans',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentSubscriptionPlan extends Model<
  InferAttributes<ContentSubscriptionPlan>,
  InferCreationAttributes<ContentSubscriptionPlan>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({
    type: DataType.ENUM('monthly', 'yearly', 'lifetime'),
    allowNull: false,
    defaultValue: 'monthly',
  })
  declare plan_type: CreationOptional<'monthly' | 'yearly' | 'lifetime'>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare is_active: CreationOptional<boolean>;

  @HasMany(() => ContentPayment)
  declare payments?: ContentPayment[];
}
