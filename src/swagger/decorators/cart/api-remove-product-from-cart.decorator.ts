import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiRemoveProductFromCartResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Remove Product from Cart' }),
    ApiOkResponse({
      description: 'Product has been successfully removed from Cart',
      example: 'Product removed from cart',
    }),
    ApiErrorResponses({
      unauthorized: true,
      notFound: true,
      badRequest: true,
      forbidden: true,
      internalServerError: true,
    }),
  );
};
