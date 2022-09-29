import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as csurf from 'csurf';
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header';
import * as compression from 'compression';
import { RequestMiddleware } from './middleware/request.middleware';
import { AnyExceptionFilter } from './filter/any-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptor/response.interceptor';

const PORT: string | number = process.env.APP_PORT || 18080;
async function bootstrap() {
  // <NestExpressApplication>静态资源目录
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 路径前缀：如：http://www.test.com/api/v1/user
  app.setGlobalPrefix('api');

  //cors：跨域资源共享，方式一：允许跨站访问
  app.enableCors();
  // 方式二：const app = await NestFactory.create(AppModule, { cors: true });

  // 防止跨站脚本攻击
  // 配置cross-origin 接口图片的资源光宇问题
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

  // CSP（内容安全策略）
  // app.use(
  //   expressCspHeader({
  //     directives: {
  //       'default-src': [SELF],
  //       'script-src': [SELF, INLINE, '127.0.0.1:18080.com'],
  //       'style-src': [SELF, 'mystyles.net'],
  //       'img-src': ['data:', '127.0.0.1:18080.com'],
  //       'worker-src': [NONE],
  //       'block-all-mixed-content': true,
  //     },
  //   }),
  // );

  // CSRF保护：跨站点请求伪造
  // app.use(csurf());

  //配置静态资源目录
  app.useStaticAssets('assets');

  // 使用压缩中间件启用 gzip 压缩
  // app.use(compression());

  // 配置swagger文档
  const config = new DocumentBuilder()
    .setTitle('echo9z blog')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 监听所有的请求路由，并打印日志
  app.use(new RequestMiddleware().use);
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 捕获全局异常
  app.useGlobalFilters(new AnyExceptionFilter());

  await app.listen(
    PORT,
    () => console.log(`服务已经启动 http://localhost:${PORT}`),
    // Logger.log(`服务已经启动 http://localhost:${PORT}`),
  );
}
bootstrap();
