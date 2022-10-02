import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreatePageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @ApiProperty({ description: 'page名称' })
  @IsString()
  pageName: string;

  @ApiProperty({ description: '导航path路径' })
  @IsString()
  path: string;
}
