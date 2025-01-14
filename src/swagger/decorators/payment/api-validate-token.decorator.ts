import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiValidateTokenResponse = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Validate token session',
    }),
    ApiOkResponse({
      description: 'Return true or false if session is successfully or expired',
      example: true,
    }),
    ApiErrorResponses({
      notFound: true,
      unauthorized: true,
      badRequest: true,
      internalServerError: true,
    }),
  );
};
