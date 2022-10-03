import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UserRole } from './entities/user.entity';
import { Auth } from 'src/decorator/auth.decorator';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: [CreateUserDto] })
  @UseInterceptors(ClassSerializerInterceptor) // 通过class-transformer提供的@Exclude来序列化对entities字段过滤，请求 POST /api/user/register这个请求返回的数据中，就不会包含@Exclude的字段。
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return await this.userService.register(createUser);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @Get('getInfo')
  getUserInfo(@Req() req) {
    return req.user;
  }

  // 获取所有 用户信息
  @ApiOperation({ summary: '获取用户列表所有信息' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.Admin)
  @Get('userAll')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '根据获取账户名称查询用户信息' })
  @Get('username')
  @UseInterceptors(ClassSerializerInterceptor)
  async findUsername(@Body() createUser: CreateUserDto) {
    return await this.userService.findUsername(createUser.username);
  }

  @ApiOperation({ summary: '根据用户id，更新用户' })
  @Auth([UserRole.Admin])
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('profile')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.userId, updateUserDto);
  }

  @ApiOperation({ summary: '根据用户id，删除用户' })
  @Auth([UserRole.Admin])
  @Delete('profile')
  remove(createUser: CreateUserDto) {
    return this.userService.remove(createUser.userId);
  }
}
