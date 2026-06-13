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

@Table({
  tableName: 'content_likes',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentLike extends Model<
  InferAttributes<ContentLike>,
  InferCreationAttributes<ContentLike>
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
}