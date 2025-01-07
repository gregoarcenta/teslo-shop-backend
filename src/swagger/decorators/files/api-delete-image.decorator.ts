import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiDeleteImageResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete image' }),
    ApiCreatedResponse({
      description:
        'The specified image has been successfully deleted from the server.',
      example: 'The image with the id: ${id} was removed',
    }),
    ApiErrorResponses({
      badRequest: true,
      notFound: true,
      forbidden: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
