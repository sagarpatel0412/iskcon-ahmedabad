// src/common/decorators/current-user-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.headers['x-user-id']);
  },
);