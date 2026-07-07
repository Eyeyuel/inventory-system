import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@inventory-system/entities';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

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
  // async googleCallback(@CurrentUser() user: Partial<User>) {
  //   return this.authService.generateToken(user);

  //   // async googleCallback(@CurrentUser() user: Partial<User>, @Res() res: Response) {
  //   //     const tokens = this.authService.generateToken(user);
  //   //     res.json(tokens);

  //   //redirect user in the front end if you want to
  //   // res.redirect(`http://frontend.com/oauth-success?token=...`);
  // }
  async googleCallback(@CurrentUser() user: Partial<User>, @Res() res: Response) {
    const tokenData = await firstValueFrom(this.authService.generateToken(user));

    // 2. Set the Access Token as an HTTP-only cookie
    res.cookie('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (requires HTTPS)
      sameSite: 'lax', // Protects against CSRF while allowing cross-origin redirect
      maxAge: 15 * 60 * 1000, // Expiry matching your access token (e.g., 15 minutes)
    });

    // 3. Set the Refresh Token as an HTTP-only cookie
    res.cookie('refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expiry matching your refresh token (e.g., 7 days)
    });

    // 4. Redirect the browser straight to your NextJS page
    // The cookies are now embedded in the browser and will travel with this redirect
    return res.redirect('http://localhost:3000/dashboard');

    // async googleCallback(@CurrentUser() user: Partial<User>, @Res() res: Response) {
    //     const tokens = this.authService.generateToken(user);
    //     res.json(tokens);

    //redirect user in the front end if you want to
    // res.redirect(`http://frontend.com/oauth-success?token=...`);
  }
}
