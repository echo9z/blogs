import { Module } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { RedisClientController } from './redis-client.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          config: configService.get('redis').config,
          // config: {
          //   url: 'redis://localhost:6379',
          // },
        };
      },
    }),
  ],
  controllers: [RedisClientController],
  providers: [RedisClientService],
})
export class RedisClientModule {}
