import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ProductResponseDto } from '../../../products/dto';

export const ApiFindOneResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find Product by id, title, slug' }),
    ApiOkResponse({
      description: 'Product has been successfully getting.',
      type: ProductResponseDto,
    }),
    ApiErrorResponses({
      notFound: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
