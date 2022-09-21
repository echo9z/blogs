import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisClientService {
  // redis实例
  constructor(@InjectRedis() private readonly redis: Redis) {}
  //设置值的方法
  async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value);
    console.log(value);
    if (!seconds) {
      await this.redis.set(key, value);
    } else {
      await this.redis.set(key, value, 'EX', seconds);
    }
  }

  //获取值的方法
  async get(key: string) {
    const data = await this.redis.get(key);
    if (!data) return;
    return JSON.parse(data);
  }

  // 根据key删除redis缓存数据
  async del(key: string): Promise<any> {
    await this.redis.del(key);
  }

  // 清空redis的缓存
  async flushall(): Promise<any> {
    await this.redis.flushall();
  }
}
