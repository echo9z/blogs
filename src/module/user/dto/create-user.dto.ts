import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsMobilePhone,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  userId: string;

  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  username: string; // 用户名

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  nickname: string; // 昵称

  @ApiProperty({ description: '密码' })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  @MaxLength(20, {
    message: '密码长度不能超过20位',
  })
  password: string;

  @ApiProperty({ description: '确认密码' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  confirmPwd: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email: string; // 邮箱

  @ApiProperty({ description: '邮件激活唯一校验码' })
  @IsOptional()
  emailCode: string; // 新用户注册邮件激活唯一校验码

  // @ApiProperty({ description: '微信openID' })
  // @IsOptional()
  // openId: string; // wx openID

  @ApiProperty({ description: '头像' })
  @IsOptional()
  avatar: string; //头像

  @ApiProperty({ description: '手机号码' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式错误' })
  phone: string; // 号码

  @ApiProperty({ description: '用户角色' })
  @IsOptional()
  @IsEnum(['admin', 'author', 'visitor'], {
    message: 'admin或author或visitor',
  })
  role: string;
}
