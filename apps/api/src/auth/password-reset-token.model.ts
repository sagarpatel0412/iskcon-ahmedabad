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
  tableName: 'password_reset_tokens',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class PasswordResetToken extends Model<
  InferAttributes<PasswordResetToken>,
  InferCreationAttributes<PasswordResetToken>
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

  @Column({ type: DataType.TEXT, allowNull: false })
  declare token_hash: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expires_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare used_at: Date | null;
}