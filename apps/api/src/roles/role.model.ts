// src/roles/role.model.ts
import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from './user-role.model';

export interface RoleAttributes {
  id: number;
  uuid: string;
  name: string;
  description?: string | null;
}

export type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description'>;

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
    unique: true,
  })
  uuid!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string | null;

  @HasMany(() => UserRole)
  user_roles!: UserRole[];
}