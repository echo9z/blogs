/**
 * @description 用户权限装饰器
 * @fileName roles.decorator.ts
 * @author echo9z
 * @date 2022/09/20 10:30:29
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/module/user/entities/user.entity';

// @SetMetadata('roles', ['admin']) 封装为 下面通用用户权限装饰器  => @Roles('admin')
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
