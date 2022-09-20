/**
 * @description * 全局范围的异常捕获, 统一处理, 并输出error日志，原则上error信息要全部记录, 可以有选择的提取信息进行前置
 * @fileName any-exception.filter.ts
 * @author echo9z
 * @date 2022/09/13 20:54:07
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Moment from 'moment';
import { Logger } from '../utils/log4js';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('--', exception);

    // 自定义的异常信息结构, 响应用
    const error_info = exception ? exception.stack : exception;
    let error_msg = exception.response
      ? exception.response.message
        ? exception.response.message
        : exception.response.errorMsg
      : 'internal server error';
    const error_code = exception.response?.errorCode
      ? exception.response.errorCode
      : 500;

    // 404 异常响应
    if (status === HttpStatus.NOT_FOUND) {
      error_msg = `资源不存在! 接口 ${request.method} -> ${request.url} 无效!`;
    }
    console.log(request.params);
    const params = request.params === '{}' ? 'params:' + request.params : '';
    const query = request.query === '{}' ? 'query:' + request.query : '';
    const body = request.body === '{}' ? 'body:' + request.body : '';
    const logFormat = `URL: ${request.originalUrl} Method: ${request.method} IP: ${request.ip} HttpCode: ${status} ${params} ${query} ${body} statusCode: ${error_code} errorMsg: ${error_msg} errorInfo: ${error_info}`;

    Logger.error(logFormat);
    response.status(status || 500).json({
      code: status || 500,
      time: Moment().format('YYYY-MM-DD HH:mm:ss'),
      path: request.url,
      msg: `${(exception as any).message}`,
    });
  }
}
