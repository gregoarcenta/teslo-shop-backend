import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponses } from '../api-error-responses.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponseDto } from '../../../auth/dto/user-response.dto';

export const ApiSignInResponse = () => {
  return applyDecorators(
    ApiOperation({ summary: 'User Login' }),
    ApiOkResponse({
      description: 'User has been successfully login.',
      type: UserResponseDto,
    }),
    ApiErrorResponses({
      badRequest: true,
      unauthorized: true,
      internalServerError: true,
    }),
  );
};
