import { BeforeInsert, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { makeSalt, encryptPassword } from 'src/utils/cryptogram';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ length: 100 })
  nickname: string; // 昵称

  @Column({ length: 100 })
  wxOpenId: string; // wxID

  @Exclude() // 对返回的数据实现过滤掉password字段的效果
  @Column({ select: false, nullable: true }) // 进行查询时是否默认隐藏此列
  password: string; // 密码

  @Column({ default: null })
  userEmail: string; // 邮箱

  @Column({ default: null })
  userEmailCode: string; // 新用户注册邮件激活唯一校验码

  @Column({ default: null })
  isActive: string;

  @Column()
  userAvatar: string; //头像

  @Column('simple-enum', { enum: ['保密', '女', '男'], default: '保密' })
  userSex: string; // 性别

  @Column({ default: null })
  userWx: string; // 微信号

  @Column({ default: null })
  phone: string; // 手机号

  @Column('simple-enum', {
    enum: ['nan', 'author', 'visitor'],
    default: 'visitor',
  })
  role: string; // 用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await encryptPassword(this.password, makeSalt());
  }
}
