import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    if (data === 'optional' && !user) {
      return null;
    }

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    if (data && data === 'optional') {
      return user;
    }

    return data ? user[data] : user;
  },
);
