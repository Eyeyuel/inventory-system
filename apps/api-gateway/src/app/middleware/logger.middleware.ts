import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, query, params, body } = request;
    const userAgent = request.get('user-agent') || '';

    // Sanitize body: remove sensitive fields
    const sanitizedBody =
      body && typeof body === 'object'
        ? Object.fromEntries(
            Object.entries(body).filter(
              ([key]) =>
                !['password', 'token', 'secret', 'authorization'].includes(key.toLowerCase()),
            ),
          )
        : body;

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        {
          method,
          url: originalUrl,
          statusCode,
          contentLength,
          userAgent,
          ip,
          query,
          params,
          body: sanitizedBody,
        },
        `${method} ${originalUrl} ${statusCode}`,
      );
    });

    next();
  }
}
