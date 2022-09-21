import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { CreateRedisClientDto } from './dto/create-redis-client.dto';
import { UpdateRedisClientDto } from './dto/update-redis-client.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('redis')
@Controller('redis')
export class RedisClientController {
  // 注入redis服务
  constructor(private readonly redisClientService: RedisClientService) {}

  @Get('get')
  async get(@Query() query) {
    return await this.redisClientService.get(query.key);
  }

  @Post('set')
  async set(@Body() body) {
    const { key, ...params } = body as any;
    return await this.redisClientService.set(key, params);
  }

  @Get('del')
  async del(@Query() query) {
    return await this.redisClientService.del(query.key);
  }

  @Get('delAll')
  async delAll() {
    return await this.redisClientService.flushall();
  }
}
