import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ProductResponseDto } from '../../../products/dto';

export const ApiFindSearchSuggestionsResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find search suggestions for Products' }),
    ApiOkResponse({
      description:
        'Product search suggestions have been successfully retrieved.',
      type: [ProductResponseDto],
    }),
    ApiErrorResponses({
      badRequest: true,
      internalServerError: true,
    }),
  );
};
