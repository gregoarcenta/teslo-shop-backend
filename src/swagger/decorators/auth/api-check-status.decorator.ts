import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { UserResponseDto } from '../../../modules/auth/dto';

export const ApiCheckStatusResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by json web token' }),
    ApiOkResponse({
      description: 'The user has been getting successfully obtained.',
      type: UserResponseDto,
    }),
    ApiErrorResponses({
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
