import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiRemoveResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Remove Product' }),
    ApiOkResponse({
      description: 'Product has been successfully removed.',
      example: 'Product example-product has been removed',
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
