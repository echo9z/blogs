import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '请输入分类名' })
  catName: string;

  @IsOptional()
  catPid: number;

  @IsOptional()
  catLevel: string; // 分类层级 0: 顶级 1:二级 2:三级

  @IsOptional()
  catDeleted: number; // cat_deleted 是否删除 1为删除

  @IsOptional()
  catIco: string;
}
