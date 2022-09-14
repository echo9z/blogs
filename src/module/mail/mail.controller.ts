import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/sendCode') // /mail/sendCode
  async sendEmailCode(@Body() data) {
    return this.mailService.sendEmailCode(data);
  }
}
