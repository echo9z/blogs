import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
    const user = await this.userRepository.findOne({
      where: { username: createUser.username },
    });
    if (user) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST); // 抛出400
    }
    const newUser = await this.userRepository.create(createUser); // 创建User的新实例
    const result = await this.userRepository.save(newUser);
    return { msg: '注册成功', result }; // 将user实例插入的数据库中
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: string) {
    return await this.userRepository.findOne({ where: { userId } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
