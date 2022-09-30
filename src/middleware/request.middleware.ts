/**
 * @description 统一处理请求中间件
 * @fileName request.middleware.ts
 * @author echo9z
 * @date 2022/09/19 21:36:53
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../utils/log4js';
@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const code = res.statusCode; //响应状态吗
    next();

    // 组装信息
    // eslint-disable-next-line prettier/prettier
    const logFormat = `Request original url: ${req.originalUrl} Method: ${req.method} IP: ${req.ip} Status code: ${code} Parmas: ${JSON.stringify(req.params)} Query: ${JSON.stringify(req.query)} Body: ${JSON.stringify(req.body)}`;

    // 根据状态码进行日志类型区分
    if (code >= 500) {
      Logger.error(logFormat);
    } else if (code >= 400) {
      Logger.warn(logFormat);
    } else {
      Logger.access(logFormat);
      Logger.log(logFormat);
    }
  }
}
