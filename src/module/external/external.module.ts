import { Module } from '@nestjs/common';
import { ExternalService } from './external.service';
import { ExternalController } from './external.controller';
import { HttpModule } from '@nestjs/axios';
import { RedisClientModule } from '../redis-client/redis-client.module';

@Module({
  imports: [
    // 导入axios http请求模块
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // 缓存模块
    RedisClientModule,
  ],
  controllers: [ExternalController],
  providers: [ExternalService],
  exports: [ExternalService],
})
export class ExternalModule {}
