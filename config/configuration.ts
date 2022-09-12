/**
 * @description 项目配置文件信息、数据库信息、jwt、smtp其他等等
 * @fileName configuration.ts
 * @author echo9z
 * @date 2022/09/12 16:14:12
 */
export default () => ({
  dataBase: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost', // 通过 export DB_HOST=127.0.0.1，在启动项目之前先添加环境
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'wzh123',
    database: process.env.DB_NAME || 'blogs',
    synchronize: process.env.DB_SYNCHRONIZE || true, // 自动载入模型
    autoLoadEntities: true, // 自动导入实体
    maxQueryExecutionTime: 1000, // 记录超过1秒的查询
    logging: false, // 是否打印日志,执行sql语句时候输出原生sql,
  },
});
