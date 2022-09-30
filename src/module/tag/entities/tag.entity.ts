import { Exclude } from 'class-transformer';
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
}
