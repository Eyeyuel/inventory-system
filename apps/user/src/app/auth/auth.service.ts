import { Injectable, Logger } from '@nestjs/common';
import { LoginDto, OAuthUserDto, SignUpDto } from '@inventory-system/dto';
import { UsersService } from '../users/users.service';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { TokenType, User } from '@inventory-system/entities';
import { ConfigService } from '@nestjs/config';
import { handleRpcException } from '@inventory-system/constants';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  private generateToken(user: Partial<User>): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
  private generateRefreshToken(user: Partial<User>): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne({ email: loginDto.email });

    // if user is not verified add a get verification token logic
    if (!user.isVerified)
      throw new RpcException({ statusCode: 401, message: 'Verify your email first' });

    // Check if user has a password (i.e., not an OAuth-only account)
    if (!user.password) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials', // same generic message to prevent enumeration
      });
    }
    // Compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const { password, ...result } = user;

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { result, access_token: token, refresh_token: refreshToken };
  }

  async loginOauthUser(user: Partial<User>) {
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { user, access_token: token, refresh_token: refreshToken };
  }

  async signUp(signUpDto: SignUpDto) {
    const result = await this.userService.create(signUpDto);
    // const { password, ...result } = user;
    // const token = this.generateToken(result);
    // const refreshToken = this.generateRefreshToken(result);
    // return { result, access_token: token, refresh_token: refreshToken };
    const token = await this.tokenService.createToken(
      result.id,
      result.email,
      TokenType.EMAIL_VERIFICATION,
      15,
    );

    // await this.mailService.sendVerificationEmail(user.email, token);
    return `http://localhost:3000/reset-password?token=${token}`;
  }

  // if a user signs up and does not verify emain immidiately they can request verfication again with this method
  async resendVerification(email: string) {
    try {
      const user = await this.userService.findOne({ email });

      if (user.isVerified) {
        throw new RpcException({
          statusCode: 400,
          message: 'User already verified',
        });
      }

      const token = await this.tokenService.createToken(
        user.id,
        user.email,
        TokenType.EMAIL_VERIFICATION,
        15,
      );

      return `http://localhost:3000/reset-password?token=${token}`;
      // await this.mailService.sendVerificationEmail(user.email, token);
    } catch (error) {
      handleRpcException(error, 'Database error while resending verification');
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userService.findOne({ email });

      // Security: Always return same message even if user not found
      // to prevent email enumeration.
      if (!user) {
        // Do not throw error; simply return success without sending email.
        return { message: 'If that email exists, a reset link has been sent.' };
      }

      const token = await this.tokenService.createToken(
        user.id,
        user.email,
        TokenType.PASSWORD_RESET,
        15,
      );

      // await this.mailService.sendResetPasswordEmail(user.email, token);

      return `http://localhost:3000/reset-password?token=${token}`;
    } catch (error) {
      handleRpcException(error, 'Database error while processing forgot password');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // verifyToken will throw RpcException if invalid/expired
      const data = await this.tokenService.verifyToken(token, TokenType.PASSWORD_RESET);

      const user = await this.userService.findOne({ id: data.userId, email: data.email });

      await this.userService.updateUser({ ...user, password: newPassword });

      await this.tokenService.delete(data.id);

      const newToken = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        message: 'Password updated successfully',
        access_token: newToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      handleRpcException(error, 'Database error while resetting password');
    }
  }

  async verifyEmail(token: string) {
    const tokenResponse = await this.tokenService.verifyToken(token, TokenType.EMAIL_VERIFICATION);

    const user = await this.userService.findOne({ id: tokenResponse.userId });

    user.isVerified = true;
    await this.userService.verifyEmail(user);

    await this.tokenService.delete(tokenResponse.id);

    const newToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      message: 'Email verified successfully',
      access_token: newToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refresh_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      if (!payload) {
        throw new RpcException({
          statusCode: 403,
          message: 'Invalid or expired refresh token',
        });
      }
      const { sub, email } = payload;
      // return { sub, email };
      const newAccesstoken = this.generateToken({ id: sub, email });
      const newRefreshToken = this.generateRefreshToken({ id: sub, email });
      return { access_Token: newAccesstoken, refresh_token: newRefreshToken };
    } catch (error) {
      handleRpcException(error, 'Invalid or expired refresh token');
    }
  }

  async validateGoogleUser(oAuthUserDto: OAuthUserDto) {
    let user = await this.userService.findOneOrNull({ email: oAuthUserDto.email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await this.userService.createOauthUser(oAuthUserDto);
    }

    return user;
  }
}
