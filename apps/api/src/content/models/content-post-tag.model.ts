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

import { ContentPost } from './content-post.model';
import { ContentTag } from './content-tag.model';

@Table({
  tableName: 'content_post_tags',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentPostTag extends Model<
  InferAttributes<ContentPostTag>,
  InferCreationAttributes<ContentPostTag>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
    unique: true,
  })
  declare uuid: string;

  @ForeignKey(() => ContentPost)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare post_id: number;

  @BelongsTo(() => ContentPost)
  declare post?: ContentPost;

  @ForeignKey(() => ContentTag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare tag_id: number;

  @BelongsTo(() => ContentTag)
  declare tag?: ContentTag;
}