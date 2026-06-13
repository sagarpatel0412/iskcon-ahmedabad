import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { ContentPostTag } from './content-post-tag.model';

@Table({
  tableName: 'content_tags',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentTag extends Model<
  InferAttributes<ContentTag>,
  InferCreationAttributes<ContentTag>
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

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare slug: string;

  @HasMany(() => ContentPostTag)
  declare post_tags?: ContentPostTag[];
}