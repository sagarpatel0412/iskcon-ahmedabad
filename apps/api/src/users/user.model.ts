// src/users/user.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Centre } from '../centres/centre.model';
import { UserRole } from '../roles/user-role.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
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

  @ForeignKey(() => Centre)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare centre_id: number | null;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  declare last_name: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true,
  })
  declare phone: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password_hash: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare country_code: string | null;

  @Column({
  type: DataType.ENUM('male', 'female', 'other'),
    allowNull: true,
  })
  declare gender: 'male' | 'female' | 'other' | null;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare state_code: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare city: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare address_line_1: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare address_line_2: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare landmark: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare postal_code: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: CreationOptional<boolean>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_verified_devotee: CreationOptional<boolean>;

  @BelongsTo(() => Centre)
  declare centre?: Centre;

  @HasMany(() => UserRole)
  declare user_roles?: UserRole[];
}