import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ProductResponseDto } from '../../../products/dto';

export const ApiUpdateResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update Product' }),
    ApiOkResponse({
      description: 'Product has been successfully updated.',
      type: ProductResponseDto,
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
