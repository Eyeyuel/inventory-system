import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Response } from "express";

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError() as any;
    const status = error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error?.message || "Internal server error from rpc exception filter.";
    response.status(status).json({ statusCode: status, message });
  }
}
