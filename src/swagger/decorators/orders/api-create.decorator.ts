import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { OrderResponseDto } from '../../../orders/dto';

export const ApiCreateResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create new order' }),
    ApiCreatedResponse({
      description: 'Order has been successfully created.',
      type: OrderResponseDto,
    }),
    ApiErrorResponses({
      unauthorized: true,
      notFound: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
