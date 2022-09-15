import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // 生成token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    // token中携带 id、username 和role
    const token = this.createToken({
      userId: user.userId,
      username: user.username,
      role: user.role,
    });
    console.log();
    const { nickname, role } = user;
    return { msg: '登录成功', result: { nickname, role, token } };
  }

  // 根据id查询用户信息
  async getUser(user: Partial<User>) {
    return await this.userService.findOne(user.userId);
  }
}
