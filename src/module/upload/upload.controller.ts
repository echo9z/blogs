// upload.controller.ts
import {
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { UserRole } from '../user/entities/user.entity';
import { Auth } from 'src/decorator/auth.decorator';
import { FastifyFileInterceptor } from '../../interceptor/fastify-file/fastify-file.interceptor';
import { diskStorage } from 'multer';
import { join } from 'path';
import { fileMapper, filesMapper } from '../../utils/file-mapper';
import { SingleFileDto } from './dto/single-file-dto';

@ApiTags('上传文件')
@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @Post('single-file')
  @UseInterceptors(
    FastifyFileInterceptor(
      join(__dirname, '../../assets/uploads'), 
      {
        storage: diskStorage({
          destination: join(
            __dirname,
            `../../assets/uploads/${new Date().toLocaleDateString()}`,
          ),
          filename: (req, file, cb) => {
            const filename = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
            return cb(null, filename);
          },
        }),
        // fileFilter: imageFileFilter,
      }
    ),
  )
  single(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SingleFileDto,
  ) {
    return { ...body, photo_url: fileMapper({ file, req }) };
  }

  @ApiOperation({ summary: '单文件上传' })
  @Auth([UserRole.Admin, UserRole.Author])
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    const { filename, path, mimetype } =
      await this.uploadService.uploadSingleFile(file);

    return {
      filename,
      mimetype,
      url: `http://127.0.0.1:18080/${path.substring(path.indexOf('uploads'))}`,
    };
  }

  @ApiOperation({ summary: '多文件上传' })
  @Auth([UserRole.Admin, UserRole.Author])
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMuliFile(@UploadedFiles() files, @Body() body) {
    this.uploadService.UploadMuliFile(files, body);
    return true;
  }

  @ApiOperation({ summary: '压缩文件下载' })
  @Auth([UserRole.Admin, UserRole.Author])
  @Get('export')
  async downloadAll(@Res() res: Response) {
    const { filename, tarStream } = await this.uploadService.downloadAll();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    tarStream.pipe(res);
  }
}
