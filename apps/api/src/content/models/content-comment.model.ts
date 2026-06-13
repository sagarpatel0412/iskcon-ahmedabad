import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { User } from '../../users/user.model';
import { ContentPost } from './content-post.model';

@Table({
  tableName: 'content_comments',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentComment extends Model<
  InferAttributes<ContentComment>,
  InferCreationAttributes<ContentComment>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => ContentPost)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare post_id: number;

  @BelongsTo(() => ContentPost)
  declare post?: ContentPost;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user?: User;

  @ForeignKey(() => ContentComment)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare parent_comment_id: number | null;

  @BelongsTo(() => ContentComment, 'parent_comment_id')
  declare parent_comment?: ContentComment;

  @HasMany(() => ContentComment, 'parent_comment_id')
  declare replies?: ContentComment[];

  @Column({ type: DataType.TEXT, allowNull: false })
  declare comment: string;
}