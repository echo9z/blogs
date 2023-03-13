import { Controller, Get } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('外部服务')
@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @ApiOperation({ summary: '获取每日一言' })
  @Get('getOneSay')
  getOneSay() {
    return this.externalService.fetchOneSay();
  }
}
