import { LoginDto, LoginResponseDto, SignUpDto, SignupResponseDto } from '@inventory-system/dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { UsersService } from './users.service';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Login using email and password' })
  @ApiOkResponse({
    description: 'Success. Sets httpOnly cookie "access_token.',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto)
  }

  @ApiOperation({ summary: 'Signup using email, name and password' })
  @ApiCreatedResponse({
    description: 'Success. Sets httpOnly cookie "access_token.',
    type: SignupResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials', })
  @Post('signup')
  async register(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @ApiOkResponse({
    description: 'Success. Return new access_token and refresh_token.',
    // type:
    // {
    //   access_token: String,
    //   refresh_token: String
    // }
  })
  @ApiBadRequestResponse({ description: 'Invalid Refresh Token', })
  @Post('refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    return this.usersService.refresh(refresh_token);
  }
}
