/**
 * @description log4jsConfig配置文件
 * @fileName log4jsConfig.ts
 * @author echo9z
 * @date 2022/09/13 14:08:18
 */
import * as path from 'path';
const baseLogPath = path.resolve(__dirname, '../../logs');

const log4jsConfig = {
  // 作用是配置输出源, 用于定义输出日志的各种格式, 后续我们真正输出日志的对象就是log4js的下属的输出源.
  appenders: {
    console: { type: 'console' }, // 控制打印至控制台
    // 统计日志
    access: {
      type: 'dateFile', // 写入文件格式，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.2021-04-01.log
      alwaysIncludePattern: true, // 为true, 则每个文件都会按pattern命名，否则最新的文件不会按照pattern命名
      pattern: 'yyyy-MM-dd', // 日期格式
      // maxLogSize: 10485760,  // 日志大小
      daysToKeep: 30, // 文件保存日期30天
      numBackups: 3, //  配置日志文件最多存在个数
      compress: true, // 配置日志文件是否压缩
      category: 'http', // category 类型
      keepFileExt: true, // 是否保留文件后缀
    },
    // 一些app的 应用日志
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      }, // 自定义的输出格式, 可参考 https://blog.csdn.net/hello_word2/article/details/79295344
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    mail: {
      type: 'dateFile',
      filename: `${baseLogPath}/mail/mail.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      }, // 自定义的输出格式, 可参考 https://blog.csdn.net/hello_word2/article/details/79295344
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      compress: true, // 配置日志文件是否压缩
      category: 'mail', // category 类型
      keepFileExt: true,
    },
    mysql: {
      type: 'dateFile',
      filename: `${baseLogPath}/datasql/sql.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      }, // 自定义的输出格式, 可参考 https://blog.csdn.net/hello_word2/article/details/79295344
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      compress: true, // 配置日志文件是否压缩
      category: 'mysql', // category 类型
      keepFileExt: true,
    },
    // 异常日志
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/error/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 30,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },

  // category 类型, 可以设置一个 Logger 实例的类型，按照另外一个维度来区分日志.
  categories: {
    default: {
      appenders: ['console', 'access', 'app', 'errors'],
      level: 'DEBUG', // 日志调试阶段
    },
    mail: { appenders: ['mail', 'errors'], level: 'info' },
    mysql: { appenders: ['mysql', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
};

export default log4jsConfig;
