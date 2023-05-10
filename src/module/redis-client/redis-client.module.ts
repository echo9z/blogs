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
        const redis = configService.get('redis');
        return {
          readyLog: redis.log,
          config: {
            host: redis.host,
            port: redis.port,
            password: redis.password,
            db: redis.db,
            // tls: redis.tls, // ca 证书
            onClientCreated(client) {
              try {
                client.on('error', (err) => {
                  console.log(err);
                });
                client.on('ready', () => {
                  // console.log('redis to ready');
                });
              } catch (error) {
                console.log(error);
              }
            },
          },
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
