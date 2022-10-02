import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ description: '导航page名称' })
  @IsNotEmpty({ message: '请输入page名称' })
  @IsString()
  pageName: string;

  @ApiProperty({ description: '导航路径' })
  @IsNotEmpty({ message: '请输入path路径' })
  @IsString()
  path: string;
}
