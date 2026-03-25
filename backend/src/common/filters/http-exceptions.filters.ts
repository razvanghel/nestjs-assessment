import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errors: string[] | undefined;
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as {
          message?: string | string[];
          error?: string;
          errorCode?: string;
        };

        message = res.message || res.error || message;
        errorCode = res.errorCode;

        if (Array.isArray(res.message)) {
          errors = res.message;
          message = 'Validation failed';
        }
      }
    } else {
      this.logger.error('Unexpected error', exception instanceof Error ? exception.stack : '');
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(errorCode && { errorCode }),
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
