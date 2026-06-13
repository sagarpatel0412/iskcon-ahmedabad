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

import { ContentPostCategory } from './content-post-category.model';

@Table({
  tableName: 'content_categories',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentCategory extends Model<
  InferAttributes<ContentCategory>,
  InferCreationAttributes<ContentCategory>
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

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @HasMany(() => ContentPostCategory)
  declare post_categories?: ContentPostCategory[];
}