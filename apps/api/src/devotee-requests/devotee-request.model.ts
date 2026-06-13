// src/devotee-requests/devotee-request.model.ts

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
import { Centre } from '../centres/centre.model';

@Table({
  tableName: 'devotee_requests',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class DevoteeRequest extends Model<
  InferAttributes<DevoteeRequest>,
  InferCreationAttributes<DevoteeRequest>
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

  @ForeignKey(() => Centre)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare centre_id: number;

  @Column(DataType.STRING(255))
  declare spiritual_name: string | null;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare current_malas: number;

  @Column({
    type: DataType.ENUM('none', 'harinam', 'diksha'),
    defaultValue: 'none',
  })
  declare initiation_status: 'none' | 'harinam' | 'diksha';

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare years_associated: number;

  @Column(DataType.TEXT)
  declare services: string | null;

  @Column(DataType.STRING(255))
  declare devotee_reference_name: string | null;

  @Column(DataType.STRING(20))
  declare devotee_reference_phone: string | null;

  @Column(DataType.TEXT)
  declare reason: string | null;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'approved' | 'rejected';

  @Column(DataType.INTEGER)
  declare reviewed_by: number | null;

  @Column(DataType.DATE)
  declare reviewed_at: Date | null;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Centre)
  declare centre?: Centre;
}