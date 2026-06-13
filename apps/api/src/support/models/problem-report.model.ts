import { Table, Column, Model, DataType } from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({
  tableName: 'problem_reports',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProblemReport extends Model<
  InferAttributes<ProblemReport>,
  InferCreationAttributes<ProblemReport>
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: CreationOptional<number>;

  @Column({ type: DataType.CHAR(36), allowNull: false, unique: true })
  declare uuid: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare name: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone: string | null;

  @Column({
    type: DataType.ENUM(
      'login_issue',
      'payment_issue',
      'event_issue',
      'content_issue',
      'app_bug',
      'other',
    ),
    defaultValue: 'other',
  })
  declare problem_type: CreationOptional<
    | 'login_issue'
    | 'payment_issue'
    | 'event_issue'
    | 'content_issue'
    | 'app_bug'
    | 'other'
  >;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare page_url: string | null;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  })
  declare priority: CreationOptional<'low' | 'medium' | 'high' | 'urgent'>;

  @Column({
    type: DataType.ENUM('new', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'new',
  })
  declare status: CreationOptional<'new' | 'in_progress' | 'resolved' | 'closed'>;
}