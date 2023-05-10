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
import * as Moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const params = !_.isEmpty(req.params);
    const query = !_.isEmpty(req.query);
    const body = !_.isEmpty(req.body);
    const logFormat = `Response original url: ${req.originalUrl} Method: ${
      req.method
    } IP: ${req.ip} ${params ? `Parmas: ${JSON.stringify(req.params)}` : ''} ${
      query ? `Query: ${JSON.stringify(req.query)}` : ''
    } ${body ? `Body: ${JSON.stringify(req.body)}` : ''}`;
    return next.handle().pipe(
      // data 就是postscontroller 返回的数据对象
      map((data) => {
        // console.log('全局响应拦截器方法返回内容后...');
        Logger.info(logFormat);
        Logger.access(logFormat);
        return {
          status: 200,
          timestamp: Moment().format('YYYY-MM-DD HH:mm:ss'),
          // path: req.url,
          message: '请求成功',
          data: data,
        };
      }),
    );
  }
}
