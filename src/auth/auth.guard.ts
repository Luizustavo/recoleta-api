import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = this.extractTokenFromHeader(request);
    if (!authorization)
      throw new UnauthorizedException('Authorization token not found');

    try {
      const payload = this.jwtService.verify<{ sub: string }>(authorization, {
        secret: process.env.SECRET_KEY,
      });
      request['sub'] = payload;
      console.log('payload', payload);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
