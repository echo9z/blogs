import { Module } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { RedisClientController } from './redis-client.controller';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
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
  exports: [RedisClientService],
})
export class RedisClientModule {}
