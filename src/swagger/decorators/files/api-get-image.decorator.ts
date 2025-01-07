import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export const ApiGetImageResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get image from cloudinary' }),
    ApiOkResponse({
      description: 'The requested image has been successfully retrieved.',
    }),
    ApiErrorResponses({
      badRequest: true,
      notFound: true,
      internalServerError: true,
    }),
  );
};
