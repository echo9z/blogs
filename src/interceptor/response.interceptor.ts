/**
 * @description 统一处理请求响应拦截器
 * @fileName response.interceptor.ts
 * @author echo9z
 * @date 2022/09/13 17:37:01
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Logger } from '../utils/log4js';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      // data 就是postscontroller 返回的数据对象
      map((data) => {
        // console.log('全局响应拦截器方法返回内容后...');
        // eslint-disable-next-line prettier/prettier
        const logFormat = `Response original url: ${req.originalUrl} Method: ${req.method} IP: ${req.ip} Parmas: ${JSON.stringify(req.params)} Query: ${JSON.stringify(req.query)} Body: ${JSON.stringify(req.body)}`;

        Logger.info(logFormat);
        Logger.access(logFormat);
        return {
          status: 200,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: '请求成功',
          data: data,
        };
      }),
    );
  }
}
