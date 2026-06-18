import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { AuthToken } from '../auth-token.model';
import { User } from '../../users/user.model';
import { UserRole } from '../../roles/user-role.model';
import { Role } from '../../roles/role.model';

const COOKIE_NAME = 'krishna_session';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectModel(AuthToken)
    private readonly authTokenModel: typeof AuthToken,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromRequest(request);

    const { uuid, rawToken } = this.parseSessionToken(token);

    const tokenRecord = await this.authTokenModel.findOne({
      where: {
        uuid,
        revoked_at: null,
        expires_at: {
          [Op.gt]: new Date(),
        },
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

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const isMatch = await bcrypt.compare(
      rawToken,
      tokenRecord.token_hash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = tokenRecord.user?.get({ plain: true });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User inactive');
    }

    request.user = user;
    request.authToken = tokenRecord.get({ plain: true });

    return true;
  }

  private getTokenFromRequest(request: any) {
    const cookieToken = request.cookies?.[COOKIE_NAME];

    if (cookieToken) {
      return cookieToken;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    return token;
  }

  private parseSessionToken(token: string) {
    const [uuid, rawToken] = token.split('.');

    if (!uuid || !rawToken) {
      throw new UnauthorizedException('Invalid token format');
    }

    return {
      uuid,
      rawToken,
    };
  }
}