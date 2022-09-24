import { Exclude } from 'class-transformer';
import { Articles } from 'src/module/articles/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('e_category')
export class Category {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number;

  @Column()
  name: string;

  // 文章分类 一个分类 对应 多个文章
  @OneToMany(() => Articles, (articles) => articles.category)
  articles: Articles[];

  @Exclude()
  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
}
