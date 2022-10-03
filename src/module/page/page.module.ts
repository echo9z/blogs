import { ArticlesModule } from './../articles/articles.module';
import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page]),
    CategoryModule,
    TagModule,
    ArticlesModule,
  ],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
