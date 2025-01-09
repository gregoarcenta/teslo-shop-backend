import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { CartItemResponseDto } from '../../../cart/dto';

export const ApiAddProductToCartResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Add product to cart' }),
    ApiCreatedResponse({
      description: 'Product has been successfully added to cart.',
      type: CartItemResponseDto,
    }),
    ApiErrorResponses({
      notFound: true,
      forbidden: true,
      unauthorized: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
