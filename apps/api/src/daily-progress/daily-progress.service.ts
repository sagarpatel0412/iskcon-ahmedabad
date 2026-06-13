import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DailyProgress } from './daily-progress.model';
import { CreateDailyProgressDto } from './dto/create-daily-progress.dto';
import { UpdateDailyProgressDto } from './dto/update-daily-progress.dto';
import { User } from '../users/user.model';
import { ProgressLevel } from './progress-level.model';
import { Op } from 'sequelize';

@Injectable()
export class DailyProgressService {
  constructor(
    @InjectModel(DailyProgress)
    private readonly dailyProgressModel: typeof DailyProgress,

    @InjectModel(ProgressLevel)
    private readonly progressLevelModel: typeof ProgressLevel,
  ) {}

  async createOrUpdate(dto: CreateDailyProgressDto, user: User) {
    const existing = await this.dailyProgressModel.findOne({
      where: {
        user_id: user.id,
        progress_date: dto.progress_date,
      },
    });

    if (existing) {
      await existing.update({
        mala_count: dto.mala_count ?? existing.mala_count,
        lecture_attended: dto.lecture_attended ?? existing.lecture_attended,
        lecture_title: dto.lecture_title ?? existing.lecture_title,
        books_read_count: dto.books_read_count ?? existing.books_read_count,
        current_book: dto.current_book ?? existing.current_book,
        book_status: dto.book_status ?? existing.book_status,
        notes: dto.notes ?? existing.notes,
      });

      return {
        message: 'Daily progress updated successfully',
        progress: existing,
      };
    }

    const progress = await this.dailyProgressModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      progress_date: dto.progress_date,
      mala_count: dto.mala_count ?? 0,
      lecture_attended: dto.lecture_attended ?? false,
      lecture_title: dto.lecture_title ?? null,
      books_read_count: dto.books_read_count ?? 0,
      current_book: dto.current_book ?? null,
      book_status: dto.book_status ?? 'not_started',
      notes: dto.notes ?? null,
    } as any);

    return {
      message: 'Daily progress added successfully',
      progress,
    };
  }

  async findMine(user: User) {
    return this.dailyProgressModel.findAll({
      where: {
        user_id: user.id,
      },
      order: [['progress_date', 'DESC']],
    });
  }

  async findToday(user: User) {
    const today = new Date().toISOString().slice(0, 10);

    const progress = await this.dailyProgressModel.findOne({
      where: {
        user_id: user.id,
        progress_date: today,
      },
    });

    return {
      date: today,
      progress,
    };
  }

  async summary(user: User) {
    const records = await this.dailyProgressModel.findAll({
      where: {
        user_id: user.id,
      },
    });

    const totalDays = records.length;

    const totalMala = records.reduce(
      (sum, item) => sum + Number(item.mala_count || 0),
      0,
    );

    const totalLectures = records.filter(
      (item) => item.lecture_attended,
    ).length;

    const totalBooks = records.reduce(
      (sum, item) => sum + Number(item.books_read_count || 0),
      0,
    );

    const completedBooks = records.filter(
      (item) => item.book_status === 'completed',
    ).length;

    return {
      total_days_logged: totalDays,
      total_mala: totalMala,
      total_lectures_attended: totalLectures,
      total_books_read_count: totalBooks,
      completed_books_entries: completedBooks,
    };
  }

  async update(uuid: string, dto: UpdateDailyProgressDto, user: User) {
    const progress = await this.dailyProgressModel.findOne({
      where: {
        uuid,
        user_id: user.id,
      },
    });

    if (!progress) {
      throw new NotFoundException('Daily progress not found');
    }

    await progress.update({
      progress_date: dto.progress_date ?? progress.progress_date,
      mala_count: dto.mala_count ?? progress.mala_count,
      lecture_attended: dto.lecture_attended ?? progress.lecture_attended,
      lecture_title: dto.lecture_title ?? progress.lecture_title,
      books_read_count: dto.books_read_count ?? progress.books_read_count,
      current_book: dto.current_book ?? progress.current_book,
      book_status: dto.book_status ?? progress.book_status,
      notes: dto.notes ?? progress.notes,
    });

    return {
      message: 'Daily progress updated successfully',
      progress,
    };
  }

  async remove(uuid: string, user: User) {
    const progress = await this.dailyProgressModel.findOne({
      where: {
        uuid,
        user_id: user.id,
      },
    });

    if (!progress) {
      throw new NotFoundException('Daily progress not found');
    }

    await progress.destroy();

    return {
      message: 'Daily progress deleted successfully',
    };
  }

  async getMyProgressLevel(user: User) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressRows = await this.dailyProgressModel.findAll({
      where: {
        user_id: user.id,
        progress_date: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    let totalMala = 0;
    let lectureCount = 0;
    let booksReadCount = 0;
    let completedBookCount = 0;
    let ongoingBookCount = 0;

    for (const row of progressRows) {
      totalMala += Number(row.mala_count || 0);
      booksReadCount += Number(row.books_read_count || 0);

      if (row.lecture_attended) {
        lectureCount += 1;
      }

      if (row.book_status === 'completed') {
        completedBookCount += 1;
      }

      if (row.book_status === 'ongoing') {
        ongoingBookCount += 1;
      }
    }

    const score =
      totalMala * 2 +
      lectureCount * 10 +
      booksReadCount * 5 +
      completedBookCount * 20 +
      ongoingBookCount * 8;

    const level = await this.progressLevelModel.findOne({
      where: {
        is_active: true,
        min_score: {
          [Op.lte]: score,
        },
        max_score: {
          [Op.gte]: score,
        },
      },
      order: [['level_order', 'ASC']],
    });

    return {
      score,
      last_30_days: {
        total_mala: totalMala,
        lecture_attended_count: lectureCount,
        books_read_count: booksReadCount,
        completed_book_count: completedBookCount,
        ongoing_book_count: ongoingBookCount,
        entries_count: progressRows.length,
      },
      level,
    };
  }

  getLevels() {
    return this.progressLevelModel.findAll({
      where: { is_active: true },
      order: [['level_order', 'ASC']],
    });
  }
}
