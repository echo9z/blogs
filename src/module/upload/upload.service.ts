// upload.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { tar } from 'compressing';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  uploadSingleFile(file: any) {
    console.log('file', file);
    return file;
  }
  UploadMuliFile(files: any, body: any) {
    console.log('files', files);
    return files;
  }
  // 现在所有
  async downloadAll() {
    const uploadDir = this.configService.get('file').root;
    const tarStream = new tar.Stream();
    await tarStream.addEntry(uploadDir);
    return { filename: 'download.tar', tarStream };
  }
}
