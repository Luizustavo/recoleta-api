import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    params: Prisma.UserCreateInput,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.getUserById({ email: params.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(params.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async validateToken(token: string): Promise<{
    valid: boolean;
    payload?: JwtPayload;
  }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.SECRET_KEY,
      });

      const user = await this.userService.getUserById({ id: payload.sub });
      if (!user) {
        return { valid: false };
      }

      return {
        valid: true,
        payload: {
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
          iat: payload.iat,
          exp: payload.exp,
        },
      };
    } catch {
      return { valid: false };
    }
  }
}
