import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import type { Request } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async generateCalendar(params: {
    year?: string;
    city?: string;
    country?: string;
  }) {
    const year = params.year || '2026';
    const city = params.city || 'Ahmedabad';
    const country = params.country || 'India';

    const pythonPath = process.env.PYTHON_PATH || 'python';

    const scriptPath = path.join(
      process.cwd(),
      'scripts',
      'generate_festival_calendar.py',
    );

    const events = await this.runPythonScript({
      pythonPath,
      scriptPath,
      year,
      city,
      country,
    });

    return {
      success: true,
      source: 'gaurabda',
      location: {
        city,
        country,
      },
      year: Number(year),
      data: events,
    };
  }

  private runPythonScript(params: {
    pythonPath: string;
    scriptPath: string;
    year: string;
    city: string;
    country: string;
  }): Promise<any[]> {
    const { pythonPath, scriptPath, year, city, country } = params;

    return new Promise((resolve, reject) => {
      execFile(
        pythonPath,
        [
          scriptPath,
          '--year',
          String(year),
          '--city',
          String(city),
          '--country',
          String(country),
        ],
        {
          maxBuffer: 1024 * 1024 * 5,
        },
        (error, stdout, stderr) => {
          if (error) {
            return reject(
              new InternalServerErrorException({
                success: false,
                message: 'Failed to generate festival calendar',
                error: stderr || error.message,
              }),
            );
          }

          try {
            const events = JSON.parse(stdout);
            resolve(events);
          } catch (parseError: any) {
            reject(
              new InternalServerErrorException({
                success: false,
                message: 'Failed to parse festival calendar output',
                error: parseError.message,
                raw: stdout?.slice(0, 500),
              }),
            );
          }
        },
      );
    });
  }

  public async getImages(req: Request) {
    const uploadsPath = path.join(process.cwd(), 'uploads', 'krishna-images');

    const files = fs
      .readdirSync(uploadsPath)
      .filter((file) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file))
      .sort();

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      data: files.map((file) => {
        return { image: `${baseUrl}/uploads/krishna-images/${file}` };
      }),
    };
  }

  public async getRecommendedImages(req: Request) {
    const uploadsPath = path.join(process.cwd(), 'uploads', 'krishna-images');

    const files = fs
      .readdirSync(uploadsPath)
      .filter((file) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file));

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const shuffled = [...files].sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, 4);

    return {
      data: selected.map((file) => ({
        image: `${baseUrl}/uploads/krishna-images/${file}`,
      })),
    };
  }
}
