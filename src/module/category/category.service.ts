import { Category } from './entities/category.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FindLimitDto } from 'src/dto/find-limit.dto';
import * as Moment from 'moment';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const cate = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (cate) {
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: await this.categoryRepository.save({
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
    const qb = await this.categoryRepository.createQueryBuilder('e_category');
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

  async findOne(id: number) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();
  }

  // 数量
  async getCount() {
    return await this.categoryRepository.count();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existRow = await this.categoryRepository.findOne({
      where: { id },
    });
    console.log(existRow);
    if (!existRow) {
      throw new HttpException(`id为${id}的分类不存在`, HttpStatus.BAD_REQUEST);
    }
    // 调用 Repository.merge合并函数 updateUserDto覆盖existRecord 合并
    const update = this.categoryRepository.merge(existRow, {
      ...updateCategoryDto,
      updateTime: Moment().format(),
    });
    console.log(update);
    return {
      data: await this.categoryRepository.save(update),
      message: '更新成功',
    };
  }

  async remove(id: number) {
    const existPost = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`分类${id}不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.categoryRepository.remove(existPost);
    return {
      id,
      message: '删除成功',
    };
  }
}
