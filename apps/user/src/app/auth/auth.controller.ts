import { USER_CMD } from '@inventory-system/constants';
import { LoginDto, OAuthUserDto, SignUpDto } from '@inventory-system/dto';
import { User } from '@inventory-system/entities';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { isEmail } from 'class-validator';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(USER_CMD.LOGIN)
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(USER_CMD.SIGNUP)
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern(USER_CMD.VERIFY_EMAIL)
  verifyEmail(@Payload() payload: { token: string }) {
    return this.authService.verifyEmail(payload.token);
  }

  @MessagePattern(USER_CMD.RESEND_VERIFICATION)
  resendVerification(@Payload() email: string) {
    if (!isEmail(email)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid email' });
    }
    return this.authService.resendVerification(email);
  }

  @MessagePattern(USER_CMD.FORGOT_PASSWORD)
  forgotPassword(@Payload() email: string) {
    if (!isEmail(email)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid email' });
    }
    return this.authService.forgotPassword(email);
  }

  @MessagePattern(USER_CMD.RESET_PASSWORD)
  resetPassword(@Payload() payload: { token: string; newPassword: string }) {
    return this.authService.resetPassword(payload.token, payload.newPassword);
  }

  @MessagePattern(USER_CMD.REFRESH)
  refresh(@Payload() payload: { refreshToken: string }) {
    return this.authService.refresh(payload.refreshToken);
  }

  @MessagePattern(USER_CMD.FIND_OR_CREATE_OAUTH_USER)
  validateGoogleUser(
    @Payload()
    oAuthUserDto: OAuthUserDto,
  ) {
    return this.authService.validateGoogleUser(oAuthUserDto);
  }

  @MessagePattern(USER_CMD.GENERATE_TOKENS_OAUTH_USER)
  loginOauthUser(@Payload() user: Partial<User>) {
    return this.authService.loginOauthUser(user);
  }
}
