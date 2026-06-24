import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({
  tableName: 'email_logs',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class EmailLog extends Model<
  InferAttributes<EmailLog>,
  InferCreationAttributes<EmailLog>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare template_key: string | null;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare to_email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare subject: string;

  @Column({
    type: DataType.ENUM('resend'),
    defaultValue: 'resend',
  })
  declare provider: CreationOptional<'resend'>;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare provider_message_id: string | null;

  @Column({
    type: DataType.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending',
  })
  declare status: CreationOptional<'pending' | 'sent' | 'failed'>;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare error_message: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare sent_at: Date | null;
}