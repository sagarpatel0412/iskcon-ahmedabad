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
import { ContentMedia } from './content-media.model';
import { ContentPostCategory } from './content-post-category.model';
import { ContentPostTag } from './content-post-tag.model';
import { ProgressLevel } from '../../daily-progress/progress-level.model';

@Table({
  tableName: 'content_posts',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContentPost extends Model<
  InferAttributes<ContentPost>,
  InferCreationAttributes<ContentPost>
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare author_id: number;

  @BelongsTo(() => User, 'author_id')
  declare author?: User;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    unique: true,
  })
  declare slug: string | null;

  @Column({
    type: DataType.ENUM(
      'journal',
      'newsletter',
      'article',
      'announcement',
    ),
    allowNull: false,
  })
  declare type:
    | 'journal'
    | 'newsletter'
    | 'article'
    | 'announcement';

  @Column({
    type: DataType.ENUM('free', 'paid'),
    defaultValue: 'free',
  })
  declare visibility: CreationOptional<'free' | 'paid'>;

  @Column({
    type: DataType.ENUM(
      'free',
      'subscription',
      'one_time',
      'subscription_or_one_time',
    ),
    defaultValue: 'free',
  })
  declare access_type: CreationOptional<
    | 'free'
    | 'subscription'
    | 'one_time'
    | 'subscription_or_one_time'
  >;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare excerpt: string | null;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare cover_image_url: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare thumbnail_url: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare banner_image_url: string | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  declare price_amount: CreationOptional<number>;

  @Column({
    type: DataType.STRING(10),
    defaultValue: 'INR',
  })
  declare currency: CreationOptional<string>;

  @Column({
    type: DataType.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  })
  declare status: CreationOptional<'draft' | 'published' | 'archived'>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare published_at: Date | null;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare view_count: CreationOptional<number>;

  @HasMany(() => ContentMedia)
  declare media?: ContentMedia[];

  @HasMany(() => ContentPostCategory)
  declare post_categories?: ContentPostCategory[];

  @HasMany(() => ContentPostTag)
  declare post_tags?: ContentPostTag[];

  @ForeignKey(() => ProgressLevel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare target_level_id: number | null;

  @BelongsTo(() => ProgressLevel)
  declare target_level?: ProgressLevel;
}