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

@Table({
  tableName: 'content_media',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentMedia extends Model<
  InferAttributes<ContentMedia>,
  InferCreationAttributes<ContentMedia>
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

  @Column({
    type: DataType.ENUM('image', 'video', 'pdf', 'audio'),
    defaultValue: 'image',
  })
  declare media_type: CreationOptional<
    'image' | 'video' | 'pdf' | 'audio'
  >;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare file_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare thumbnail_url: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare title: string | null;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  declare sort_order: CreationOptional<number>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_featured: CreationOptional<boolean>;
}