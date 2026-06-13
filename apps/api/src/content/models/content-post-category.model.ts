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
import { ContentCategory } from './content-category.model';

@Table({
  tableName: 'content_post_categories',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentPostCategory extends Model<
  InferAttributes<ContentPostCategory>,
  InferCreationAttributes<ContentPostCategory>
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

  @ForeignKey(() => ContentCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare category_id: number;

  @BelongsTo(() => ContentCategory)
  declare category?: ContentCategory;
}