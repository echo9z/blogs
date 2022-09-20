import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    // 导入上传文件模块
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('file'),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
