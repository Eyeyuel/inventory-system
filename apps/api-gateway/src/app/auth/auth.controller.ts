import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@inventory-system/entities';
// import type { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@CurrentUser() user: Partial<User>) {
    return this.authService.generateToken(user);

    // async googleCallback(@CurrentUser() user: Partial<User>, @Res() res: Response) {
    //     const tokens = this.authService.generateToken(user);
    //     res.json(tokens);

    //redirect user in the front end if you want to
    // res.redirect(`http://frontend.com/oauth-success?token=...`);
  }
}
