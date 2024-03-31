import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const rememberMe = true
    const maxAge = rememberMe ? 5184000000 : this.configService.get<number>('JWT_AT_EXPIRES_IN') * 1000;
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: 'lax',
      path: '/',
    };

    const domain = this.configService.get<string>('AUTH_COOKIE_DOMAIN');
    if (domain) {
      options.domain = domain;
    }

    try {

      const rsp = await this.authService.login(loginUserDto);

      if (!rsp.access_token) throw new Error()
      res.cookie(process.env.COOKIE_ACCESS_TOKEN_KEY, rsp.access_token, {
        httpOnly: true,
      }).send('Cookie set')
    } catch (e) {

    }
    // .cookie(COOKIE_REFRESH_TOKEN_KEY, loggedInData.refreshToken, options);
  }
}
