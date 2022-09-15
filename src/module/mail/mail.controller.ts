import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMailDto } from './dto/create-mail.dto';
import { MailService } from './mail.service';

@ApiTags('邮箱')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: '获取邮箱验证码' })
  @Post('/sendCode') // /mail/sendCode
  async sendEmailCode(@Body() data: CreateMailDto) {
    return this.mailService.sendEmailCode(data);
  }
}
