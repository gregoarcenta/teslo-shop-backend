import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiClearCartResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Clear user cart' }),
    ApiOkResponse({
      description: 'Cart has been successfully cleared.',
      example: 'Carts cleared',
    }),
    ApiErrorResponses({
      unauthorized: true,
      badRequest: true,
      forbidden: true,
      internalServerError: true,
    }),
  );
};
