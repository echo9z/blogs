import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindLimitDto } from 'src/dto/find-limit.dto';
import { Like, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import * as Moment from 'moment';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createCategoryDto: CreateTagDto) {
    const cate = await this.tagRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (cate) {
      throw new HttpException('标签已存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: await this.tagRepository.save({
        name: createCategoryDto.name,
      }),
      message: '创建成功',
    };
  }

  // 获取分类列表
  async findAll(find: FindLimitDto) {
    // eslint-disable-next-line prefer-const
    let { page, pageSize, sortMethod, sortField, keyword } = find;
    sortField = find.sortField || 'create_time';
    console.log(sortMethod || 'DESC');
    sortMethod = sortMethod?.toUpperCase() || 'DESC';
    page = Number(find.page || 1);
    pageSize = Number(find.pageSize || 10);
    console.log(find);

    // 使用QueryBuilder获取值
    const qb = await this.tagRepository.createQueryBuilder('e_category');
    if (keyword) {
      // 添加关键词模糊查询
      qb.where({ username: Like(`%${keyword}`) });
    }
    qb.orderBy(`e_category.${sortField}`, sortMethod as 'DESC' | 'ASC');
    qb.skip(pageSize * (page - 1)); // 跳转到第几页
    qb.take(pageSize);
    return {
      list: await qb.getMany(), // 获取多个结果
      totalNum: await qb.getCount(), // 按条件查询的数量
      total: await this.getCount(), // 总的数量
      pageSize,
      page,
    };
  }

  async findOne(id: string) {
    return await this.tagRepository
      .createQueryBuilder('e_category')
      .where('e_category.id = :id', { id })
      .getOne();
  }

  // 数量
  async getCount() {
    return await this.tagRepository.count();
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const existRow = await this.tagRepository.findOne({
      where: { id },
    });
    console.log(existRow);
    if (!existRow) {
      throw new HttpException(`id为${id}的标签不存在`, HttpStatus.BAD_REQUEST);
    }
    // 调用 Repository.merge合并函数 updateUserDto覆盖existRecord 合并
    const update = this.tagRepository.merge(existRow, {
      ...updateTagDto,
      updateTime: Moment().format(),
    });
    console.log(update);
    return {
      data: await this.tagRepository.save(update),
      message: '更新成功',
    };
  }

  async remove(id: number) {
    const existPost = await this.tagRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`标签${id}不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.tagRepository.remove(existPost);
    return {
      id,
      message: '删除成功',
    };
  }
}
