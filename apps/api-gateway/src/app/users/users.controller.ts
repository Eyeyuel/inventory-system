import {
  LoginDto,
  LoginResponseDto,
  SignUpDto,
  SignupResponseDto,
  VerifyEmailResponseDto,
  ResetPasswordDto,
} from '@inventory-system/dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { UsersService } from './users.service';
import { isEmail, isString } from 'class-validator';
import { RpcException } from '@nestjs/microservices';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_PRESETS } from '../common/throttle-presets';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @ApiOperation({ summary: 'Login using email and password' })
  @ApiOkResponse({
    description: 'Success. Sets httpOnly cookie "access_token.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async create(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @Post('signup')
  @ApiOperation({ summary: 'Signup using email, name and password' })
  @ApiCreatedResponse({
    description: 'Success. Sets httpOnly cookie "access_token.',
    type: SignupResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async register(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiCreatedResponse({
    description: 'Success: sends success message and access_token, refresh_token.',
    type: VerifyEmailResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid token' })
  async verifyEmail(@Body('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiCreatedResponse({
    description: 'Success: sends verification email.',
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Invalid token' })
  async resendVerification(@Body('email') email: string) {
    return this.usersService.resendVerification(email);
  }

  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiCreatedResponse({
    description: 'Success: token is sent to reset password (sends email).',
    type: String,
  })
  @ApiBadRequestResponse({ description: 'If that email exists, a reset link has been sent.' })
  async forgotPassword(@Body('email') email: string) {
    if (!isEmail(email)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid email' });
    }
    return this.usersService.forgotPassword(email);
  }

  // @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  // @Post('reset-password')
  // @ApiOperation({ summary: 'Reset password' })
  // @ApiCreatedResponse({
  //   description: 'Success: token is sent to reset password (sends email).',
  //   type: String,
  // })

  @Throttle({ [THROTTLE_PRESETS.users.strict.name]: THROTTLE_PRESETS.users.strict })
  @ApiOperation({ summary: 'Reset password' })
  @ApiBadRequestResponse({ description: 'Invalid token or new password' })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (!isString(resetPasswordDto.token) || !isString(resetPasswordDto.newPassword)) {
      throw new RpcException({ statusCode: 400, message: 'Invalid token or new password' });
    }
    return this.usersService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  @Throttle({ [THROTTLE_PRESETS.users.refresh.name]: THROTTLE_PRESETS.users.refresh })
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiOkResponse({
    description: 'Success. Return new access_token and refresh_token.',
    // type:
    // {
    //   access_token: String,
    //   refresh_token: String
    // }
  })
  @ApiBadRequestResponse({ description: 'Invalid Refresh Token' })
  async refresh(@Body('refresh_token') refresh_token: string) {
    return this.usersService.refresh(refresh_token);
  }
}
