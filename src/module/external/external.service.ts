import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import { RedisClientService } from '../redis-client/redis-client.service';

@Injectable()
export class ExternalService {
  constructor(
    private readonly redisClient: RedisClientService,
    private httpService: HttpService,
  ) {}

  // 每天的23:59:59，调用
  @Cron('59 59 23 * * *')
  async fetchOneSay() {
    // 先获取缓存
    const hitokoto = await this.redisClient.get('hitokoto');
    if (hitokoto) {
      return hitokoto;
    }
    // 没有缓存的逻辑
    const hitokotoOb = this.httpService.get('https://v1.hitokoto.cn', {
      responseType: 'json',
    });
    // 返回一个promise对象
    const { data } = await lastValueFrom(hitokotoOb);

    // 设置缓存 过期时间 一天
    await this.redisClient.set('hitokoto', data, 60 * 60 * 23);
    console.log(data);
    return data;
  }
}
