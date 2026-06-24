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
  tableName: 'email_templates',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class EmailTemplate extends Model<
  InferAttributes<EmailTemplate>,
  InferCreationAttributes<EmailTemplate>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare template_key: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare subject: string;

  @Column({ type: DataType.TEXT('long'), allowNull: false })
  declare html_body: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare text_body: string | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare variables_json: any;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: CreationOptional<boolean>;
}