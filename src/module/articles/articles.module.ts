import { RedisClientModule } from './../redis-client/redis-client.module';
import { TagModule } from './../tag/tag.module';
import { CategoryModule } from './../category/category.module';
import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articles]),
    CategoryModule,
    TagModule,
    RedisClientModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
