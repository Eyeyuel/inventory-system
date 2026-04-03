import { Controller, Post, Body, HttpStatus, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { SignInUserDto, SignUpDto } from '@inventory-system/dto';
import { firstValueFrom } from 'rxjs';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(@Body() signInUserDto: SignInUserDto, @Res({ passthrough: true }) res: Response) {
    const response = await firstValueFrom(this.usersService.login(signInUserDto));

    const token = response.access_token;
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      maxAge: 60 * 60 * 24 * 1000, // 1 day
    });

    return response.result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async register(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
    const response = await firstValueFrom(this.usersService.signup(signUpDto));

    const token = response.access_token;
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return response.result;
  }
}
