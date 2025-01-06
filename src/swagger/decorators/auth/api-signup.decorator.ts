import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { UserResponseDto } from '../../../auth/dto';

export const ApiSignUpResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'User Register' }),
    ApiCreatedResponse({
      description: 'User has been successfully registered.',
      type: UserResponseDto,
    }),
    ApiErrorResponses({
      badRequest: true,
      internalServerError: true,
    }),
  );
};
