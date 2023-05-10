import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiHeader,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @UseGuards(AuthGuard('local')) // Nest.js内置的守卫AuthGuard来进行验证，即数据库查询验证
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() user: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: '根据token获取用户信息' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @UseGuards(AuthGuard('jwt')) // Nest.js内置的守卫AuthGuard来进行验证token是否有效
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getInfo')
  async getInfo(@Req() req) {
    return this.authService.getUser(req.user);
  }
}
