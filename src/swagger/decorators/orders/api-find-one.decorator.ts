import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { OrderResponseDto } from '../../../orders/dto';

export const ApiFindOneResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Find order by id' }),
    ApiOkResponse({
      description: 'Order has been successfully getting.',
      type: OrderResponseDto,
    }),
    ApiErrorResponses({
      notFound: true,
      unauthorized: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
