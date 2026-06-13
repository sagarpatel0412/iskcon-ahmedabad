// src/auth/auth-token.model.ts

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

import { User } from '../users/user.model';

@Table({
  tableName: 'auth_tokens',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class AuthToken extends Model<
  InferAttributes<AuthToken>,
  InferCreationAttributes<AuthToken>
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
  declare user_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare token_hash: string;

  @Column({
    type: DataType.ENUM('android', 'ios', 'web'),
    allowNull: true,
  })
  declare device_type: 'android' | 'ios' | 'web' | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare device_name: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare ip_address: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare user_agent: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expires_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare revoked_at: Date | null;

  @BelongsTo(() => User)
  declare user?: User;
}