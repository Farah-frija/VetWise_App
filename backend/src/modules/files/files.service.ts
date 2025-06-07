import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async saveProfileImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName = `user-${userId}-profile${fileExt}`;
    const uploadPath = path.join('uploads', 'profile-images', fileName);

    await fs.rename(file.path, uploadPath);

    return this.getPublicUrl(fileName);
  }

  private getPublicUrl(filename: string): string {
    const baseUrl =
      this.configService.get('APP_URL') || 'http://localhost:3001';
    return `${baseUrl}/uploads/profile-images/${filename}`;
  }
}
