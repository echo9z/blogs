import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import configuration from '../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { DbLogger } from './utils/log4js';

//引入
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UserModule } from './module/user/user.module';
import { MailModule } from './module/mail/mail.module';
import { CategoryModule } from './module/category/category.module';
import { UploadModule } from './module/upload/upload.module';
import { RedisClientModule } from './module/redis-client/redis-client.module';
import { ArticlesModule } from './module/articles/articles.module';
import { TagModule } from './module/tag/tag.module';
import { PageModule } from './module/page/page.module';
import { ExternalModule } from './module/external/external.module';
// import parseEnv from '../config/env';
@Module({
  imports: [
    // 1.配置config目录
    ConfigModule.forRoot({
      isGlobal: true, // 全局导入
      cache: true,
      // envFilePath: [parseEnv.path], // 会读取根文件下 .env文件 `${process.env.NODE_ENV}.env`
      load: [configuration], // 读取的是自定义配置文件 configuration.ts 数据配置文件
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataBase = configService.get('db');
        return {
          type: 'mysql', // 数据库类型
          // entities: [], // 数据表实体
          host: dataBase.host, // 主机，默认为localhost
          port: dataBase.port, // 端口号
          username: dataBase.username, // 用户名
          password: dataBase.password, // 密码
          database: dataBase.name, //数据库名
          logging: dataBase.logging,
          synchronize: dataBase.synchronize, //根据实体自动创建数据库表， 生产环境建议关闭
          autoLoadEntities: dataBase.autoLoadEntities, // 自动导入entity 实体
          logger: new DbLogger(),
          timezone: '+08:00', //服务器上配置的时区
        };
      },
    }),
    // 设置对服务器请求次数
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const throttle = config.get('throttle');
        return {
          ttl: throttle.ttl, // 1分钟
          limit: throttle.limit, //请求100次
        };
      },
    }),
    AuthModule,
    UserModule,
    MailModule,
    CategoryModule,
    UploadModule,
    RedisClientModule,
    ArticlesModule,
    TagModule,
    PageModule,
    ExternalModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
