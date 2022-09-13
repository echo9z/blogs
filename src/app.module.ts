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

@Module({
  imports: [
    // 1.配置config目录
    ConfigModule.forRoot({
      isGlobal: true, // 全局导入
      cache: true,
      envFilePath: `${process.env.NODE_ENV}.env`, // 会读取根文件下 .env文件
      load: [configuration], // 读取的是自定义配置文件 configuration.ts 数据配置文件
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataBase = configService.get('dataBase');
        return {
          type: 'mysql', // 数据库类型
          // entities: [], // 数据表实体
          host: dataBase.host, // 主机，默认为localhost
          port: dataBase.port, // 端口号
          username: dataBase.username, // 用户名
          password: dataBase.password, // 密码
          database: dataBase.database, //数据库名
          logging: dataBase.logging,
          synchronize: dataBase.synchronize, //根据实体自动创建数据库表， 生产环境建议关闭
          logger: new DbLogger(),
          timezone: '+08:00', //服务器上配置的时区
        };
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60, //1分钟
      limit: 100, //请求10次
    }),
    AuthModule,
    UserModule,
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
