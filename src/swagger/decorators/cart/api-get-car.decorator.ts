import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { CartResponseDto } from '../../../cart/dto';

export const ApiGetCartResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get user cart' }),
    ApiOkResponse({
      description: 'Cart has been successfully getting.',
      type: CartResponseDto,
    }),
    ApiErrorResponses({
      badRequest: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
