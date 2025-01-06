import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ProductResponseDto } from '../../../products/dto/product-response.dto';

export const ApiFindAllResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find all Products' }),
    ApiOkResponse({
      description: 'Products has been successfully getting.',
      type: [ProductResponseDto],
    }),
    ApiErrorResponses({
      badRequest: true,
      internalServerError: true,
    }),
  );
};
