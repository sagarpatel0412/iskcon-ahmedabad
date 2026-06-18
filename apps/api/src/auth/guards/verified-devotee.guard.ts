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
      user?.user_roles
        ?.map((userRole: any) => userRole?.role?.name)
        .filter(Boolean) || [];

    const isAdmin = roles.includes('ADMIN');
    const isDevotee = roles.includes('DEVOTEE');

    if (!isDevotee && !isAdmin) {
      throw new ForbiddenException('Only devotees can access this route');
    }

    if (!user?.is_verified_devotee && !isAdmin) {
      throw new ForbiddenException('Devotee verification required');
    }

    return true;
  }
}