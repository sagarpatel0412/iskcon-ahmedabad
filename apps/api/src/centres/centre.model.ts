// src/centres/centre.model.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'centres',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Centre extends Model<Centre> {
  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  uuid!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  slug!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column(DataType.STRING(100))
  city?: string;

  @Column(DataType.STRING(100))
  state?: string;

  @Column(DataType.STRING(100))
  country?: string;

  @Column(DataType.STRING(50))
  phone?: string;

  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(255))
  website?: string;

  @Column(DataType.TEXT)
  logo_url?: string;

  @Column(DataType.TEXT)
  banner_url?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active!: boolean;

  @Column({ type: DataType.DECIMAL(10, 8), allowNull: true })
  latitude!: number;

  @Column({ type: DataType.DECIMAL(11, 8), allowNull: true })
  longitude!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  is_mother_temple!: boolean;

  @HasMany(() => User)
  users!: User[];
}