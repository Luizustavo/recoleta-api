import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Prisma, User as UserModel } from '../../generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotFoundException } from '@nestjs/common';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Registra um novo usuário no sistema',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nome completo do usuário',
          example: 'João Silva',
        },
        email: {
          type: 'string',
          description: 'Email único do usuário',
          example: 'joao@email.com',
        },
        password: {
          type: 'string',
          description: 'Senha do usuário',
          example: 'senha123',
        },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existe',
  })
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna dados de um usuário específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    const user = await this.userService.getUserById({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna lista paginada de usuários (apenas admin)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Número de registros para pular',
    type: 'number',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Número de registros para retornar',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada',
  })
  async getAllUsers(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('cursor') cursor: Prisma.UserWhereUniqueInput,
    @Query('where') where: Prisma.UserWhereInput,
    @Query('orderBy') orderBy: Prisma.UserOrderByWithRelationInput,
  ) {
    return this.userService.getAllUsers({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      cursor,
      where,
      orderBy,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza dados de um usuário existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nome do usuário',
          example: 'João Silva Santos',
        },
        email: {
          type: 'string',
          description: 'Email do usuário',
          example: 'novo-email@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<UserModel> {
    const user = await this.userService.updateUser({
      where: { id },
      data: userData,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userService.deleteUser({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
