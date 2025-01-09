import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { CartItemResponseDto } from '../../../cart/dto';

export const ApiUpdateQuantityResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update product quantity from cart' }),
    ApiOkResponse({
      description: 'Product quantity has been successfully updated.',
      type: CartItemResponseDto,
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
