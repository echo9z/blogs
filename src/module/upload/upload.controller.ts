// upload.controller.ts
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { CreateUploadDto } from './create-upload.dto';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('上传文件')
@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 单文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.uploadService.uploadSingleFile(file);
    return true;
  }

  // 多文件上传
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMuliFile(@UploadedFiles() files, @Body() body) {
    this.uploadService.UploadMuliFile(files, body);
    return true;
  }

  // 下载
  @Get('export')
  async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.uploadService.downloadAll();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    tarStream.pipe(res);
  }
}
