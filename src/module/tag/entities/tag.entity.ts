import { Articles } from 'src/module/articles/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('e_tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  // 标签名
  @Column()
  name: string;

  // 多对多 一个标签 对应 多个文章
  @ManyToMany(() => Articles, (articles) => articles.tags)
  articles: Array<Articles>;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}
