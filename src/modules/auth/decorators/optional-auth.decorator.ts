import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtOptionalAuthGuard } from '../guards/jwt-optional-auth.guard';

export const OptionalAuth = () => {
  return applyDecorators(UseGuards(JwtOptionalAuthGuard), ApiBearerAuth());
};
