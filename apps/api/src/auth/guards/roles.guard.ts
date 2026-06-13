import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // console.log(user.user_roles.dataValues,'user')

    const userRoles =
      user?.user_roles?.map((ur: any) => {
        return ur?.dataValues?.role?.dataValues?.name}) || [];

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission for this action');
    }

    return true;
  }
}