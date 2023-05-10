import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';
import { HttpModule } from '@nestjs/axios';
import { RedisClientModule } from '../redis-client/redis-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 导入axios http请求模块
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const { timeout, maxRedirects } = configService.get('axios');
        return {
          timeout,
          maxRedirects,
        };
      },
      inject: [ConfigService],
    }),
    // 缓存模块
    RedisClientModule,
  ],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
