import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../users/user.model";

@Table({
  tableName: "daily_progress",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class DailyProgress extends Model<DailyProgress> {
//   @Column({
//     type: DataType.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   })
//   id!: number;

  @Column({
    type: DataType.UUID,
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

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  progress_date!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  mala_count!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  lecture_attended!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lecture_title?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  books_read_count!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  current_book?: string;

  @Column({
    type: DataType.ENUM("not_started", "ongoing", "completed"),
    defaultValue: "not_started",
  })
  book_status!: "not_started" | "ongoing" | "completed";

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;
}