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

import { User } from '../../users/user.model';
import { ContentPost } from './content-post.model';
import { ContentPayment } from './content-payment.model';

@Table({
  tableName: 'content_post_purchases',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentPostPurchase extends Model<
  InferAttributes<ContentPostPurchase>,
  InferCreationAttributes<ContentPostPurchase>
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

  @ForeignKey(() => ContentPost)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare post_id: number;

  @BelongsTo(() => ContentPost)
  declare post?: ContentPost;

  @ForeignKey(() => ContentPayment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare payment_id: number | null;

  @BelongsTo(() => ContentPayment)
  declare payment?: ContentPayment;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare amount: number | null;

  @Column({ type: DataType.STRING(10), defaultValue: 'INR' })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('active', 'refunded', 'revoked'),
    defaultValue: 'active',
  })
  declare access_status: CreationOptional<'active' | 'refunded' | 'revoked'>;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare purchased_at: CreationOptional<Date>;
}