import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class VerifiedDevoteeGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const roles =
      user?.dataValues?.user_roles?.map((ur: any) => {
        // console.log(ur,'ur2')
        return ur?.dataValues?.role?.dataValues?.name}) || [];

      // console.log(roles,'roles')
    const isDevotee = roles.includes('DEVOTEE') || roles.includes('ADMIN');

    if (!isDevotee) {
      throw new ForbiddenException('Only devotees can access this route');
    }

    if (!user.is_verified_devotee && !roles.includes('ADMIN')) {
      throw new ForbiddenException('Devotee verification required');
    }

    return true;
  }
}