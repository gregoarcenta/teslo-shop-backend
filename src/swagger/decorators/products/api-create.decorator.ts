import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ProductResponseDto } from '../../../products/dto';

export const ApiCreateResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create new Product' }),
    ApiCreatedResponse({
      description: 'Product has been successfully created.',
      type: ProductResponseDto,
    }),
    ApiErrorResponses({
      unauthorized: true,
      badRequest: true,
      forbidden: true,
      internalServerError: true,
    }),
  );
};
