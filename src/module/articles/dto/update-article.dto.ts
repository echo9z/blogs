import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly coverUrl: string;

  @ApiPropertyOptional({ description: '文章状态' })
  readonly status: string;

  @IsNumber()
  @ApiProperty({ description: '文章分类' })
  readonly category: number;

  @ApiPropertyOptional({ description: '是否推荐' })
  readonly isRecommend: boolean;

  @ApiPropertyOptional({ description: '文章标签' })
  readonly tag: string;
}
