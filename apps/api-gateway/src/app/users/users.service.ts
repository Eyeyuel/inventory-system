import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@inventory-system/dto';
import { handleRpcException, USER_CMD } from '@inventory-system/constants';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private readonly usersClient: ClientProxy) {}

  login(loginDto: LoginDto) {
    try {
      const user = this.usersClient.send(USER_CMD.LOGIN, loginDto);
      return user;
    } catch (error) {
      handleRpcException(error, 'Login failed');
    }
  }

  signup(loginDto: LoginDto) {
    try {
      const user = this.usersClient.send(USER_CMD.SIGNUP, loginDto);
      return user;
    } catch (error) {
      handleRpcException(error, 'Signup failed');
    }
  }

  verifyEmail(token: string) {
    try {
      const verifyEmailResult = this.usersClient.send(USER_CMD.VERIFY_EMAIL, { token });
      return verifyEmailResult;
    } catch (error) {
      handleRpcException(error, 'Verify email failed');
    }
  }

  resendVerification(email: string) {
    try {
      const resendVerificationResult = this.usersClient.send(USER_CMD.RESEND_VERIFICATION, email);
      return resendVerificationResult;
    } catch (error) {
      handleRpcException(error, 'Resend verification failed');
    }
  }

  forgotPassword(email: string) {
    try {
      const forgotPasswordToken = this.usersClient.send(USER_CMD.FORGOT_PASSWORD, email);
      return forgotPasswordToken;
    } catch (error) {
      handleRpcException(error, 'Forgot password failed');
    }
  }

  resetPassword(token: string, newPassword: string) {
    try {
      const resetPasswordResult = this.usersClient.send(USER_CMD.RESET_PASSWORD, {
        token,
        newPassword,
      });
      return resetPasswordResult;
    } catch (error) {
      handleRpcException(error, 'Reset password failed');
    }
  }
  refresh(refreshToken: string) {
    try {
      const bothTokens = this.usersClient.send(USER_CMD.REFRESH, { refreshToken });
      return bothTokens;
    } catch (error) {
      handleRpcException(error, 'Refresh Token failed');
    }
  }
}
