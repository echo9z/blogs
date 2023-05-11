import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/module/user/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const methodKey = context.getHandler().name; // "create"
    // const className = context.getClass().name; // "CatsController"
    // console.log(methodKey, className);
    // 'roles' 如果在 方法中设置 @Roles('test123') 根据reflector.get反射获取元数据
    // const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()); // 获取方法中的元数据
    // const roles = this.reflector.get<string[]>('roles', context.getClass()); 获取class controller类上的元数据
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    // return false;
    const { user } = context.switchToHttp().getRequest(); // request.user 这里通passport中req.user 使用获取token中
    console.log(roles, user?.role); // 通过token中解析出信息 userId username role

    const hasRoles = roles.some((role) => role === user?.role);
    console.log(hasRoles);
    if (!hasRoles) {
      throw new UnauthorizedException('您没有权限');
    }
    return hasRoles;
  }
}
