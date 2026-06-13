import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { AuthToken } from '../auth-token.model';
import { User } from '../../users/user.model';
import { UserRole } from '../../roles/user-role.model';
import { Role } from '../../roles/role.model';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectModel(AuthToken)
    private readonly authTokenModel: typeof AuthToken,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, rawToken] = authorization.split(' ');

    if (type !== 'Bearer' || !rawToken) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const tokens = await this.authTokenModel.findAll({
      where: {
        revoked_at: null,
      },
      include: [
        {
          model: User,
          include: [
            {
              model: UserRole,
              include: [Role],
            },
          ],
        },
      ],
    });

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(rawToken, tokenRecord.token_hash);

      if (!isMatch) continue;

      if (tokenRecord.expires_at < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      const user = tokenRecord.user;

      if (!user || !user.is_active) {
        throw new UnauthorizedException('User inactive');
      }

      request.user = user;
      request.authToken = tokenRecord;

      return true;
    }

    throw new UnauthorizedException('Invalid token');
  }
}