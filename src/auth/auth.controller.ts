import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { AuthService } from './auth.service';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: Prisma.UserCreateInput) {
    return this.authService.signIn(body);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() body: ValidateTokenDto) {
    if (!body.token) {
      return { valid: false, message: 'Token is required' };
    }

    return this.authService.validateToken(body.token);
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  async validateTokenFromHeader(
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const result = await this.authService.validateToken(token);

    if (!result.valid) {
      throw new UnauthorizedException('Invalid token');
    }

    return result;
  }
}
