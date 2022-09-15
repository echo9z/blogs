import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsMobilePhone,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  username: string; // 用户名

  @ApiProperty({ description: '密码' })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  @MaxLength(20, {
    message: '密码长度不能超过20位',
  })
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  userEmail: string; // 邮箱

  @ApiProperty({ description: '邮件激活唯一校验码' })
  @IsOptional()
  userEmailCode: string; // 新用户注册邮件激活唯一校验码

  @ApiProperty({ description: '新用户是否已经通过邮箱激活帐号 0不是1是' })
  @IsOptional()
  isActive: string;

  @ApiProperty({ description: '微信ID' })
  @IsOptional()
  wxOpenId: string; // wxID

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  nickname: string; // 昵称

  @ApiProperty({ description: '头像' })
  @IsOptional()
  userAvatar: string; //头像

  @ApiProperty({ description: '性别' })
  @IsOptional()
  userSex: string; // 性别

  @ApiProperty({ description: '微信号' })
  @IsOptional()
  userWx: string; // 微信号

  @ApiProperty({ description: '手机号码' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式错误' })
  phone: string; // 号码

  @ApiProperty({ description: '用户角色' })
  @IsOptional()
  role: string;
}
