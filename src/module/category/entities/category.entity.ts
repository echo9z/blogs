import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('e_category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  catId: string;

  @Column({ length: 100, nullable: true })
  catName: string;

  @Column('int')
  catPid: number;

  @Column('simple-enum', { enum: ['0', '1', '2'], default: '0' })
  catLevel: string; // 分类层级 0: 顶级 1:二级 2:三级

  @Column('int')
  catDeleted: number; // cat_deleted 是否删除 1为删除

  @Column({ length: 100, nullable: true })
  catIco: string;

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
}
