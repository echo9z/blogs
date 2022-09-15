import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
/**
 * @description 登录DTO
 * @fileName login.dto.ts
 * @author echo9z
 * @date 2022/09/15 16:58:11
 */
export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '请输入密码' })
  password: string;
}
