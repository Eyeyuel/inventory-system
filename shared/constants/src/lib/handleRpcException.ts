// libs/shared/common/src/lib/error-handler.ts
import { RpcException } from '@nestjs/microservices';

export function handleRpcException(error: unknown, defaultMessage = 'Internal server error'): never {
    if (error instanceof Error) {
        throw new RpcException({
            statusCode: 400,
            message: error.message,
        });
    }

    if (error instanceof RpcException) {
        throw error;
    }

    throw new RpcException({
        statusCode: 500,
        message: defaultMessage,
    });
}