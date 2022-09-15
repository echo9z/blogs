import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMailDto {
  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty()
  @IsEmail()
  email: string; // 发送的邮箱

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty()
  @IsEmail()
  subject: string; // 邮箱主体

  @ApiProperty({ description: '邮件签名' })
  @IsOptional()
  sign: string;
}
