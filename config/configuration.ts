/**
 * @description 项目配置文件信息、数据库信息、jwt、smtp其他等等
 * @fileName configuration.ts
 * @author echo9z
 * @date 2022/09/12 16:14:12
 */
import file from './uploadFile.conf';
export default () => ({
  dataBase: {
    type: 'mysql',
    database: process.env.DB_NAME || 'blogs',
    host: process.env.DB_HOST || 'localhost', // 通过 export DB_HOST=127.0.0.1，在启动项目之前先添加环境
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'wzh123',
    synchronize: process.env.DB_SYNCHRONIZE || true, // 根据实体自动创建数据库表， 生产环境建议关闭
    autoLoadEntities: process.env.DB_AutoLoadEntities || true, // 自动载入模型
    maxQueryExecutionTime: process.env.DB_MaxQueryExecutionTime || 1000, // 记录超过1秒的查询
    logging: process.env.DB_Logging || true, // 是否打印日志,执行sql语句时候输出原生sql,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '123456', // 安全密钥
    expiresIn: process.env.JWT_EXPIRES_IN || '7d', // token有效时间
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  file,
  redis: {
    config: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      // db: 0,
      password: process.env.REDIS_PASS || '',
      keyPrefix: process.env.REDIS_KEY_PREFIX || '',
      onClientReady: (client) => {
        client.on('error', (err) => {
          console.log('-----redis error-----', err);
        });
      },
    },
  },
});
