import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiWebhookResponse = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Stripe Webhook - It runs when stripe fires an event',
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
