import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WasteService } from './waste.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';
import { AuthGuard } from '../auth/auth.guard';

interface AuthenticatedRequest extends Request {
  sub: {
    sub: string;
    name: string;
    email: string;
    iat: number;
    exp: number;
  };
}

@ApiTags('waste')
@Controller('waste')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar novo resíduo',
    description:
      'Cria um novo cadastro de resíduo vinculado ao usuário autenticado. Aceita campos em português que são automaticamente convertidos.',
  })
  @ApiBody({
    type: CreateWasteDto,
    description: 'Dados do resíduo e endereço de descarte',
  })
  @ApiResponse({
    status: 201,
    description: 'Resíduo cadastrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        wasteType: { type: 'string', enum: ['ELECTRONICS', 'PLASTIC', 'etc'] },
        weight: { type: 'number' },
        quantity: { type: 'number' },
        unit: { type: 'string', enum: ['KG', 'LITERS', 'UNITS'] },
        condition: { type: 'string', enum: ['NEW', 'USED', 'DAMAGED'] },
        hasPackaging: { type: 'boolean' },
        discardDate: { type: 'string', format: 'date-time' },
        additionalDescription: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        createdAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        address: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente',
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createWasteDto: CreateWasteDto,
  ): Promise<ReturnType<WasteService['createWaste']>> {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.createWaste(userId, createWasteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os resíduos do usuário',
    description:
      'Retorna todos os resíduos cadastrados pelo usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de resíduos retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          wasteType: { type: 'string' },
          weight: { type: 'number' },
          quantity: { type: 'number' },
          condition: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: { type: 'object' },
          address: { type: 'object' },
        },
      },
    },
  })
  async findAllByUser(@Request() req: AuthenticatedRequest) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.getAllWastesByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar resíduo por ID',
    description: 'Retorna um resíduo específico do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do resíduo',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Resíduo encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Resíduo não encontrado',
  })
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ReturnType<WasteService['getWasteById']>> {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.getWasteById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar resíduo',
    description: 'Atualiza dados de um resíduo específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do resíduo',
    type: 'string',
  })
  @ApiBody({
    type: UpdateWasteDto,
    description: 'Dados para atualização (campos opcionais)',
  })
  @ApiResponse({
    status: 200,
    description: 'Resíduo atualizado com sucesso',
  })
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateWasteDto: UpdateWasteDto,
  ): Promise<ReturnType<WasteService['updateWaste']>> {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.updateWaste(id, userId, updateWasteDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar resíduo',
    description: 'Remove um resíduo do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do resíduo',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Resíduo removido com sucesso',
  })
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ReturnType<WasteService['deleteWaste']>> {
    return this.wasteService.deleteWaste(id);
  }
}
