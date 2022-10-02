import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import * as Moment from 'moment';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private pageRepository: Repository<Page>,
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
