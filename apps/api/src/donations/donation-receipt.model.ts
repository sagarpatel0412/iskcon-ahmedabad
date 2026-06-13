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

import { Donation } from './donation.model';

@Table({
  tableName: 'donation_receipts',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class DonationReceipt extends Model<
  InferAttributes<DonationReceipt>,
  InferCreationAttributes<DonationReceipt>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @ForeignKey(() => Donation)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare donation_id: number;

  @BelongsTo(() => Donation)
  declare donation?: Donation;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare receipt_number: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare pdf_url: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare issued_at: Date | null;
}