import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Role } from './role.model';

export interface UserRoleAttributes {
  id: number;
  uuid: string;
  user_id: number;
  role_id: number;
}

export type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'id'>;

@Table({
  tableName: 'user_roles',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> {
  @Column({
    type: DataType.CHAR(36),
    allowNull: false,
    unique: true,
  })
  uuid!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Role)
  role!: Role;
}