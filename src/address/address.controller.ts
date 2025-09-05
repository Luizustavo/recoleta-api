import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Criar novo endereço',
    description: 'Cria um novo endereço vinculado ao usuário autenticado',
  })
  @ApiBody({
    type: CreateAddressDto,
    description: 'Dados do endereço',
  })
  @ApiResponse({
    status: 201,
    description: 'Endereço criado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente',
  })
  create(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req: { sub: string },
  ) {
    return this.addressService.create(createAddressDto, { sub: req.sub });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar todos os endereços',
    description: 'Retorna todos os endereços do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de endereços retornada com sucesso',
  })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar endereço por ID',
    description: 'Retorna um endereço específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do endereço',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Endereço não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar endereço',
    description: 'Atualiza dados de um endereço específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do endereço',
    type: 'string',
  })
  @ApiBody({
    type: UpdateAddressDto,
    description: 'Dados para atualização (campos opcionais)',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço atualizado com sucesso',
  })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Deletar endereço',
    description: 'Remove um endereço do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do endereço',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço removido com sucesso',
  })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
