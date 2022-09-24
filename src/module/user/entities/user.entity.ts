import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { encrypt } from 'src/utils/cryptogram';
import { Exclude } from 'class-transformer';
import { Articles } from 'src/module/articles/entities/article.entity';

// 用户角色
export enum UserRole {
  Admin = 'admin',
  Author = 'author',
  Visitor = 'visitor',
}
@Entity('e_user') // e_user 对应数据库中的表名
export class User {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ length: 100, nullable: true })
  username: string; // 昵称

  @Column({ length: 100, nullable: true })
  nickname: string; // 昵称

  @Exclude() // 对返回的数据实现过滤掉password字段的效果
  @Column({ select: false, nullable: true }) // 进行查询时是否默认隐藏此列
  password: string; // 密码

  @Column({ default: null })
  email: string; // 邮箱

  @Exclude()
  @Column({ default: null })
  emailCode: string; // 新用户注册邮件激活唯一校验码

  @Exclude()
  @Column({ default: null })
  openid: string; // wxID

  @Column({ default: null })
  avatar: string; //头像

  @Column({ default: null })
  phone: string; // 手机号

  @Column({
    type: 'enum',
    enum: UserRole,
    default: 'visitor',
  })
  role: string; // 用户角色

  @Exclude()
  @Column({ default: '0' }) // 新用户是否已经通过邮箱激活帐号 0不是1是
  isActive: string;

  // 外联 到 articles表的 author字段， 一个用户 对应多个 文章
  @OneToMany(() => Articles, (articles) => articles.author)
  articles: Articles[];

  @Exclude()
  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Exclude()
  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert() // 在插入之前
  async encryptPwd() {
    if (!this.password) return;
    this.password = encrypt(this.password);
  }
}
