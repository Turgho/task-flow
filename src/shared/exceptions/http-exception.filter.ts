// src/shared/exceptions/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP Exception Filter that catches all exceptions thrown in the application
 * and formats a consistent error response.
 * 
 * Key Features:
 * - Catches both HTTP exceptions and unexpected errors
 * - Standardizes error response format
 * - Automatic error logging
 * - Request context in logs
 * - Error message sanitization
 */
@Catch() // Decorator to catch all exceptions (both HttpException and others)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Main exception handling method
   * @param exception The thrown exception
   * @param host Provides access to request/response objects
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine appropriate HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // Use status from HttpException
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unexpected errors

    // Get error message or default
    const message =
      exception instanceof HttpException
        ? exception.getResponse() // Get the response object/message
        : 'Internal server error';

    // Log the error details
    this.logError(request, exception, status);

    // Send formatted error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.sanitizeMessage(message), // Clean up error message
    });
  }

  /**
   * Logs error details with different levels based on status code
   * @param request The incoming request object
   * @param exception The caught exception
   * @param status HTTP status code
   */
  private logError(request: Request, exception: unknown, status: number) {
    const method = request.method;
    const url = request.url;
    const now = new Date().toISOString();

    if (status >= 500) {
      // Server errors (5xx) get full error stack
      this.logger.error(
        `[${now}] ${method} ${url} - Error: ${exception instanceof Error ? exception.stack : exception}`,
      );
    } else {
      // Client errors (4xx) get warning level logging
      this.logger.warn(
        `[${now}] ${method} ${url} - Status: ${status} - Message: ${exception instanceof HttpException ? exception.getResponse() : exception}`,
      );
    }
  }

  /**
   * Normalizes error messages to consistent format
   * @param message Raw error message (could be string or object)
   * @returns Sanitized message in consistent format
   */
  private sanitizeMessage(message: string | object): string | object {
    if (typeof message === 'string') {
      return message; // Already formatted
    }

    // Handle validation error arrays
    if (Array.isArray(message['message'])) {
      return { ...message, message: message['message'].join(', ') };
    }

    return message;
  }
}