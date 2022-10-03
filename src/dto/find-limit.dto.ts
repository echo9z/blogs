import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

/**
 *  page 页码 1
 * pageSize 页尺寸 10
 * sortField 排序字段 createTime时间排序
 * sortMethod desc
 */
export class FindLimitDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '搜索关键字', default: 10 })
  @IsOptional()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '搜索关键字' })
  @IsOptional() // 搜索关键字
  keyword?: string = '';

  @ApiPropertyOptional({
    description: '排序字段 update_time',
    default: 'update_time',
  })
  @IsOptional()
  sortField?: string = 'update_time'; // 排序字段

  @ApiPropertyOptional({ description: '排序方式 desc 或 asc', default: 'desc' })
  @IsOptional()
  @IsEnum(['DESC', 'ASC'])
  sortMethod?: string = 'DESC'; // 排序方法
}
