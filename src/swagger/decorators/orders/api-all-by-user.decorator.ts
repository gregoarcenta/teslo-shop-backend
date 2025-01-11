import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { OrderResponseDto } from '../../../orders/dto';

export const ApiFindAllByUserResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find all orders from a user' }),
    ApiOkResponse({
      description: 'Orders has been successfully getting.',
      type: [OrderResponseDto],
    }),
    ApiErrorResponses({
      unauthorized: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
