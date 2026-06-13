import { Table, Column, Model, DataType } from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({
  tableName: 'contact_messages',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContactMessage extends Model<
  InferAttributes<ContactMessage>,
  InferCreationAttributes<ContactMessage>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare subject: string | null;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare message: string;

  @Column({
    type: DataType.ENUM('new', 'read', 'replied', 'closed'),
    defaultValue: 'new',
  })
  declare status: CreationOptional<'new' | 'read' | 'replied' | 'closed'>;
}