import { Controller, Get, Ip } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ip')
  ip(@Ip() ip) {
    console.log(ip);
    return ip;
  }
}
