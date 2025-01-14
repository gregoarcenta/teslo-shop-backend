import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiCreatePaymentSessionResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create new payment session' }),
    ApiCreatedResponse({
      description: 'payment session has been successfully created.',
    }),
    ApiErrorResponses({
      unauthorized: true,
      forbidden: true,
      notFound: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
