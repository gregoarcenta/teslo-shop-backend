import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';

export const ApiUploadImageResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Upload image to cloudinary.' }),
    ApiCreatedResponse({
      description: 'The image was successfully uploaded to the server.',
      example: { public_id: 's6xa6iiwa7pew6rpymbq.jpg', format: 'jpg' },
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
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
