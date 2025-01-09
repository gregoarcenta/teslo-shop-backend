import { ApiResponseInterceptor } from './api-response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('ApiResponseInterceptor', () => {
  let interceptor: ApiResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new ApiResponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response correctly', () => {
    // Create a mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
        getRequest: () => ({ reqId: '123' }),
      }),
    } as ExecutionContext;

    // Create a mock CallHandler
    const mockCallHandler = {
      handle: () => of({ message: 'Success', data: { name: 'Test' } }),
    } as CallHandler;

    // Call the interceptor
    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          statusCode: 200,
          reqId: '123',
          message: 'Success',
          data: { name: 'Test' },
        });
      });
  });

  it('should handle response without message correctly', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
        getRequest: () => ({ reqId: '123' }),
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ data: { name: 'Test' } }),
    } as CallHandler;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual({
          statusCode: 200,
          reqId: '123',
          message: '',
          data: { name: 'Test' },
        });
      });
  });
});
