/**
 * 上传文件配置
 */
import { diskStorage } from 'multer';
import { join } from 'path';
export default {
  root: join(__dirname, '../../assets/uploads'),
  storage: diskStorage({
    // 文件储存位置
    destination: join(
      __dirname,
      `../../assets/uploads/${new Date().toLocaleDateString()}`,
    ),
    // 文件名称
    filename: (req, file, cb) => {
      const filename = `${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
      return cb(null, filename);
    },
  }),
};
