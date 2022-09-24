import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as Moment from 'moment';

@Injectable()
export class UserService {
  // 根据User 实体，通过依赖注入方式创建 usersRepository实例
  constructor(
    @InjectRepository(User) // 在服务里面使用@InjectRepository获取数据库Model实现操作数据库
    private userRepository: Repository<User>,
  ) {}

  /**
   * 账号密码注册
   * @param createUser - 前端传入数据
   */
  async register(createUser: CreateUserDto) {
    const { username, password, confirmPwd, avatar } = createUser;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST); // 抛出400
    if (password !== confirmPwd)
      throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST);
    if (!avatar) {
      Object.assign(createUser, {
        // eslint-disable-next-line prettier/prettier
        avatar: `https://avatars.dicebear.com/api/pixel-art/:${Math.floor(Math.random()*10)}.jpg`,
      });
    }
    const newUser = await this.userRepository.create(createUser); // 创建User的新实例
    const result = await this.userRepository.save(newUser);
    return { msg: '注册成功', result }; // 将user实例插入的数据库中
  }

  async findAll() {
    return await this.userRepository.createQueryBuilder('user').getMany();
  }

  async findOne(userId: string) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async findUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const existRow = await this.userRepository.findOne({
      where: { userId },
    });
    console.log(existRow);
    if (!existRow) {
      throw new HttpException(`修改的用户不存在`, HttpStatus.BAD_REQUEST);
    }
    // 调用 Repository.merge合并函数 updateUserDto覆盖existRecord 合并
    const update = this.userRepository.merge(existRow, {
      ...updateUserDto,
      updateTime: Moment().format(),
    });
    console.log(update);
    return await this.userRepository.save(update);
  }

  async remove(userId: string) {
    const existPost = await this.userRepository.findOne({
      where: { userId },
    });
    if (!existPost) {
      throw new HttpException(`删除用户不存在`, HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.remove(existPost);
    return {
      message: '删除成功',
    };
  }
}
