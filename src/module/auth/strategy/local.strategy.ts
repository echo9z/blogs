import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { compareSync } from 'src/utils/cryptogram';
/**
 * @description 本地验证策略
 * @fileName local.strategy.ts
 * @author echo9z
 * @date 2022/09/15 15:38:22
 */
export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // 如果不是username、password， 在constructor中配置
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    // 查询用户密码，在进行比对
    const user = await this.userRepository
      .createQueryBuilder('e_user')
      .addSelect('e_user.password')
      .where('e_user.username=:username', { username })
      .getOne();

    if (!user) {
      throw new BadRequestException('用户名不存在！');
    }
    // console.log(password, user.password);2
    // 将数据库中查询到的密码，通过 compareSync封装 AES进行解密进行效验
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码不正确！');
    }
    return user;
  }
}
