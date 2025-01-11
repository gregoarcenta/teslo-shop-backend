import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { OrderResponseDto } from '../../../orders/dto';

export const ApiFindAllResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find all orders' }),
    ApiOkResponse({
      description: 'Orders has been successfully getting.',
      type: [OrderResponseDto],
    }),
    ApiErrorResponses({
      forbidden: true,
      unauthorized: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
