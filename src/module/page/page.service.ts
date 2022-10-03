import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import * as Moment from 'moment';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private pageRepository: Repository<Page>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly articlesService: ArticlesService,
  ) {}

  async create(pageDto: CreatePageDto) {
    console.log(pageDto);
    const page = await this.pageRepository.findOne({
      where: [{ pageName: pageDto.pageName }, { path: pageDto.path }],
    });
    if (page) {
      throw new HttpException('page已存在', HttpStatus.BAD_REQUEST);
    }
    const newPage = await this.pageRepository.save({
      pageName: pageDto.pageName,
      path: pageDto.path,
    });
    return {
      id: newPage.id,
      name: newPage.pageName,
    };
  }

  async findAllPage() {
    return await this.pageRepository.find();
  }

  async findArticleInfo() {
    const art = await this.articlesService.getCount();
    const cate = await this.categoryService.getCount();
    const tag = await this.tagService.getCount();
    const result = ['文章', '分类', '标签'];
    const counts = [art, cate, tag];
    const res = [];
    for (let i = 0; i < result.length; i++) {
      res.push({
        name: result[i],
        count: counts[i],
      });
    }
    return res;
  }

  async findOne(id: number) {
    return await this.pageRepository
      .createQueryBuilder('page')
      .where('page.id = :id', { id })
      .getOne();
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    const existRow = await this.pageRepository.findOne({
      where: { id },
    });
    console.log(existRow);
    if (!existRow) {
      throw new HttpException(`id为${id}的分类不存在`, HttpStatus.BAD_REQUEST);
    }
    // 调用 Repository.merge合并函数 updateUserDto覆盖existRecord 合并
    const update = this.pageRepository.merge(existRow, {
      ...updatePageDto,
      updateTime: Moment().format(),
    });
    console.log(update);
    return {
      data: await this.pageRepository.save(update),
      message: '更新成功',
    };
  }

  async remove(id: number) {
    const existPost = await this.pageRepository.findOne({
      where: { id },
    });
    if (!existPost) {
      throw new HttpException(`page${id}不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.pageRepository.remove(existPost);
    return {
      id,
      message: '删除成功',
    };
  }
}
