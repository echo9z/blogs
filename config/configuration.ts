/**
 * @description 项目配置文件信息、数据库信息、jwt、smtp其他等等
 * @fileName configuration.ts
 * @author echo9z
 * @date 2022/09/12 16:14:12
 */

import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import * as _ from 'lodash';
import file from './uploadFile.conf';

const envPath = join(
  __dirname,
  '../config',
  `${process.env.NODE_ENV || 'development'}.config.yaml`,
);

const envConfig = yaml.load(readFileSync(envPath, 'utf8'));
export default () => {
  return _.merge(envConfig, file) as Record<string, any>;
};
