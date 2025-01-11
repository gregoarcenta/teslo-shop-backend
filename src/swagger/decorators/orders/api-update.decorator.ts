import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { OrderResponseDto } from '../../../orders/dto';

export const ApiUpdateResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update order' }),
    ApiOkResponse({
      description: 'Order has been successfully updated.',
      type: OrderResponseDto,
    }),
    ApiErrorResponses({
      unauthorized: true,
      notFound: true,
      forbidden: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
