/**
 * @description 是否是生产环境还是
 * @fileName env.ts
 * @author echo9z
 * @date 2022/09/15 13:29:27
 */
import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production'; // 是否生成是生产环境

function parseEnv() {
  // 开发环境
  const localEnv = path.resolve('.env');
  // console.log(localEnv);
  // 生产环境
  const prodEnv = path.resolve('.env.prod');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件');
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path: filePath };
}
export default parseEnv();
