import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: Prisma.UserCreateInput) {
    return this.authService.signIn(body);
  }
}
