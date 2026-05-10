import { InjectRepository } from '@nestjs/typeorm';
import { TokenType, VerificationToken } from '@inventory-system/entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { RpcException } from '@nestjs/microservices';
import { handleRpcException } from '@inventory-system/constants';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(VerificationToken)
    private repo: Repository<VerificationToken>,
  ) {}

  private generateRawToken(): string {
    return randomBytes(32).toString('hex');
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async createToken(userId: string, email: string, type: TokenType, minutes: number) {
    const raw = this.generateRawToken();
    const tokenHash = this.hash(raw);

    // invalidate old tokens
    await this.repo.delete({ userId, type });

    await this.repo.save({
      userId,
      tokenHash,
      email,
      type,
      expiresAt: new Date(Date.now() + minutes * 60000),
    });

    return raw; // send to email
  }

  async verifyToken(raw: string, type: TokenType) {
    try {
      const tokenHash = this.hash(raw);
      const token = await this.repo.findOne({
        where: { tokenHash, type },
      });

      if (!token) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid token',
        });
      }

      if (token.expiresAt < new Date()) {
        throw new RpcException({
          statusCode: 401,
          message: 'Token expired',
        });
      }

      return token;
    } catch (error) {
      handleRpcException(error, 'Database error while verifying token');
    }
  }

  async delete(id: string) {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) {
        throw new RpcException({
          statusCode: 404,
          message: 'Verification token not found',
        });
      }
      return result;
    } catch (error) {
      handleRpcException(error, 'Database error while deleting token');
    }
  }
}
