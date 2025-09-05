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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Prisma } from '../../generated/prisma';
import { AuthService } from './auth.service';
import { ValidateTokenDto } from './dto/validate-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica um usuário e retorna um token JWT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'usuario@email.com',
          description: 'Email do usuário',
        },
        password: {
          type: 'string',
          example: 'senha123',
          description: 'Senha do usuário',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async signIn(@Body() body: Prisma.UserCreateInput) {
    return this.authService.signIn(body);
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar token JWT (POST)',
    description: 'Valida um token JWT enviado no body da requisição',
  })
  @ApiBody({
    type: ValidateTokenDto,
    description: 'Token JWT para validação',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado da validação do token',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        payload: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            iat: { type: 'number' },
            exp: { type: 'number' },
          },
        },
      },
    },
  })
  async validateToken(@Body() body: ValidateTokenDto) {
    if (!body.token) {
      return { valid: false, message: 'Token is required' };
    }

    return this.authService.validateToken(body.token);
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Validar token JWT (GET)',
    description: 'Valida um token JWT enviado no header Authorization',
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token JWT',
    required: true,
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        payload: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            iat: { type: 'number' },
            exp: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou ausente',
  })
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
