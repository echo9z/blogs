import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as csurf from 'csurf';
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header';
import { RequestMiddleware } from './middleware/request.middleware';
import { AnyExceptionFilter } from './filter/any-exception.filter';

async function bootstrap() {
  // <NestExpressApplication>静态资源目录
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 路径前缀：如：http://www.test.com/api/v1/user
  // app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new AnyExceptionFilter)
  //cors：跨域资源共享，方式一：允许跨站访问
  app.enableCors();
  // 方式二：const app = await NestFactory.create(AppModule, { cors: true });

  // 防止跨站脚本攻击
  app.use(helmet());

  // CSP（内容安全策略）
  app.use(
    expressCspHeader({
      directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, '127.0.0.1:18080.com'],
        'style-src': [SELF, 'mystyles.net'],
        'img-src': ['data:', '127.0.0.1:18080.com'],
        'worker-src': [NONE],
        'block-all-mixed-content': true,
      },
    }),
  );

  // CSRF保护：跨站点请求伪造
  // app.use(csurf({ cookie: true }));

  //配置静态资源目录
  app.useStaticAssets('public');

  // 监听所有的请求路由，并打印日志
  app.use(new RequestMiddleware().use);

  const PORT = process.env.PORT || 18080;
  await app.listen(
    PORT,
    () => console.log(`服务已经启动 http://localhost:${PORT}`),
    // Logger.log(`服务已经启动 http://localhost:${PORT}`),
  );
}
bootstrap();
