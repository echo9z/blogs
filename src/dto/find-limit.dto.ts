import { IsEnum, IsOptional } from 'class-validator';

/**
 *  page 页码 1
 * pageSize 页尺寸 10
 * sortField 排序字段 createTime时间排序
 * sortMethod desc
 */
export class FindLimitDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 10;

  @IsOptional() // 搜索关键字
  keyword?: string = '';

  @IsOptional()
  sortField?: string = 'createTime'; // 排序字段

  @IsOptional()
  @IsEnum(['DESC', 'ASC'])
  sortMethod?: string = 'DESC'; // 排序方法
}
