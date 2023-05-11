import { Exclude } from 'class-transformer';
import { Category } from 'src/module/category/entities/category.entity';
import { Tag } from 'src/module/tag/entities/tag.entity';
import { User } from 'src/module/user/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('e_articles')
export class Articles {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number; // 标记为主列，值自动生成
  // 文章标题
  @Column({ length: 50 })
  title: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  content: string;

  // 文章内容 html
  @Exclude()
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  summary: string;

  // 封面图
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;

  // 阅读量
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  // 点赞量
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  // 推荐显示
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;

  // 文章状态
  @Column('enum', { enum: ['draft', 'publish'], default: 'publish' })
  status: string;

  // 作者 关联的user的 id
  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({
    name: 'author',
  })
  author: User;

  // 分类 一个文章 对应 多个分类
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  // 标签 一个文章 article_tag字段 对应多个 标签
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    // typeORM处理方式 在数据中添加一个表 让article与article_tag在个表 一对多，让tag与这个article_tag 一对多，从而形成多对多
    name: 'article_tag',
    joinColumns: [{ name: 'article_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: Tag[];

  // 文章发布时间
  @Column({ type: 'timestamp', name: 'publish_time', default: null })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
