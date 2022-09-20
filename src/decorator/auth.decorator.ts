import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'src/module/user/entities/user.entity';
import { Roles } from 'src/module/auth/roles/roles.decorator';
import { RolesGuard } from 'src/module/auth/roles/roles.guard';

// 使用 @Auth('admin')
export function Auth(roles: UserRole) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
    Roles(roles),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}
