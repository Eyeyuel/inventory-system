import { RpcException } from '@nestjs/microservices';
export function handleRpcException(
  error: unknown,
  defaultMessage = 'Internal server error',
): never {
  if (error instanceof RpcException) {
    throw error;
  }

  if (error instanceof Error) {
    throw new RpcException({
      statusCode: 400,
      message: error.message,
    });
  }

  throw new RpcException({
    statusCode: 500,
    message: defaultMessage,
  });
}
