import { FindLimitDto } from 'src/dto/find-limit.dto';
import { TagService } from './../tag/tag.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Articles } from './entities/article.entity';
import moment from 'src/utils/momentUtil';
import { User } from '../user/entities/user.entity';
import { RedisClientService } from '../redis-client/redis-client.service';
import { SnowflakeIdGenerate } from 'src/utils/snowflake';
@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private articlesRepository: Repository<Articles>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly redisClientService: RedisClientService,
  ) {}

  async create(user, articles: CreateArticleDto) {
    const { title } = articles;
    if (!title) throw new HttpException('缺少文章标题', HttpStatus.BAD_REQUEST);

    // const art = await this.articlesRepository.findOne({ where: { title } });
    // if (art) throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);

    const { tag, category, status, isRecommend } = articles;
    // 根据所选择的id，获取对应id分类
    const cate = await this.categoryService.findOne(category ? category : 1);
    // 将 1,2,3字符串转换为 数组
    const tags = await this.tagService.findByIds(('' + tag).split(','));

    // Partial 可以将 接口 或者 对象中的属性变为可选择的属性  type Partial<T> = { [P in keyof T]?: T[P]; }
    // 准备文章参数
    const param: Partial<Articles> = {
      id: new SnowflakeIdGenerate().generate(),
      ...articles,
      isRecommend: isRecommend ? 1 : 0,
      category: cate,
      tags,
      author: user,
    };

    // 添加的文章的状态为 可发布的，将添加生成最新的事件
    if (status === 'publish')
      Object.assign(param, { publishTime: new moment().formatDate() });

    const newArticle: Articles = await this.articlesRepository.create({
      ...param,
    });
    // console.log(newArticle);
    const created = await this.articlesRepository.save(newArticle);

    // 返回创建文章的id
    return {
      message: '创建文章成功',
      articleId: created.id,
    };
  }

  async findAll(query: FindLimitDto) {
    // eslint-disable-next-line prefer-const
    let { page, pageSize, category, tag, sortMethod, sortField, keyword } =
      query;
    sortField = query.sortField || 'update_time';
    sortMethod = query.sortMethod?.toUpperCase() || 'DESC';
    page = Number(query.page || 1);
    pageSize = Number(query.pageSize || 10);

    const qb = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.author', 'user');
    if (category) {
      qb.where({ category });
    }
    if (tag) {
      qb.andWhere('article_tag.tag_id = :tag', { tag: tag });
    }
    // 如果文章关键词存在，则条件like查询条件
    if (keyword) {
      qb.andWhere({ title: Like(`%${keyword}%`) });
    }
    qb.orderBy(`article.${sortField}`, sortMethod as 'DESC' | 'ASC');
    qb.skip(pageSize * (page - 1)); // 跳转到第几页
    qb.take(pageSize); // 一页显示几行
    // const sql = qb.getSql()
    // console.log(sql)
    return {
      list: await qb.getMany(), // 获取多个结果
      totalNum: await qb.getCount(), // 按条件查询的数量
      total: await this.getCount(), // 总的数量
      pageSize,
      page,
    };
  }

  // 按照每日 发布的文章 进行分组统计
  async getArchives() {
    const data = await this.articlesRepository
      .createQueryBuilder()
      .select([`DATE_FORMAT(update_time, '%Y年%m月') time`, `COUNT(*) count`])
      .where('status=:status', { status: 'publish' })
      .groupBy('time')
      .orderBy('time', 'DESC')
      .getRawMany();
    return data;
  }

  /**
   * @param time 比如 time = 2022年09月
   */
  async getArchiveList(time): Promise<Articles[]> {
    const data = await this.articlesRepository
      .createQueryBuilder()
      .where('status=:status', { status: 'publish' })
      .andWhere(`DATE_FORMAT(update_time, '%Y年%m月')=:time`, { time: time })
      .orderBy('update_time', 'DESC')
      .getRawMany();
    return data;
  }

  async getCount() {
    return await this.articlesRepository.count();
  }

  /** 根据id查询对应文章 */
  async findById(id: number): Promise<any> {
    const isExist: string = await this.redisClientService.get(`article-${id}`);
    if (isExist) {
      const article = await this.articlesRepository.findOne({ where: { id } });
      const qb = this.articlesRepository.createQueryBuilder('article');
      await qb
        .update()
        .set({ viewCount: article.viewCount + 1 })
        .where('id = :id', { id })
        .execute();
      return JSON.parse(isExist);
    }
    const article = await this.articlesRepository.findOne({ where: { id } });
    const qb = this.articlesRepository.createQueryBuilder('article');
    await qb
      .update()
      .set({ viewCount: article.viewCount + 1 })
      .where('id = :id', { id })
      .execute();

    qb.leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.author', 'user')
      .where('article.id=:id')
      .setParameter('id', id);
    // console.log(qb);
    const result = await qb.getOne();
    const art = {
      author: result.author,
      content: result.content,
      coverUrl: result.coverUrl,
      create_time: result.create_time,
      id: result.id,
      isRecommend: result.isRecommend,
      likeCount: result.likeCount,
      publishTime: result.publishTime,
      status: result.status,
      summary: result.summary,
      tags: result.tags,
      title: result.title,
      update_time: result.update_time,
      viewCount: result.viewCount,
    };
    this.redisClientService.set(`article-${id}`, JSON.stringify(art), 3600);
    return art;
  }

  async updateById(user: User, id: number, updateArticleDto: UpdateArticleDto) {
    const existPost = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'user')
      .where('article.id=:id')
      .setParameter('id', id)
      .getOne();

    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    if (existPost.author.userId !== user.userId)
      throw new HttpException(`无权限修改文章`, HttpStatus.BAD_REQUEST);

    const { category, tag, status } = updateArticleDto;
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const cate = await this.categoryService.findOne(category);
    const newArticle = {
      ...updateArticleDto,
      isRecommend: updateArticleDto.isRecommend ? 1 : 0,
      category: cate,
      tags,
      publishTime: status === 'publish' ? new Date() : existPost.publishTime,
    };

    // 将查询到的对象数据与 客户端提交数据线，合并为的新newArticle
    const updatePost = this.articlesRepository.merge(existPost, newArticle);
    return (await this.articlesRepository.save(updatePost)).id;
  }

  async remove(id: number) {
    const existPost = await this.articlesRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }
    return await this.articlesRepository.remove(existPost);
  }
}
