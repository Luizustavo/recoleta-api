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

@Controller('waste')
@UseGuards(AuthGuard)
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createWasteDto: CreateWasteDto,
  ) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.createWaste(userId, createWasteDto);
  }

  @Get()
  async findAllByUser(@Request() req: AuthenticatedRequest) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.getAllWastesByUser(userId);
  }

  @Get(':id')
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.getWasteById(id, userId);
  }

  @Patch(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateWasteDto: UpdateWasteDto,
  ) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.updateWaste(id, userId, updateWasteDto);
  }

  @Delete(':id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.sub.sub; // Obtém o ID do usuário do token JWT
    return this.wasteService.deleteWaste(id, userId);
  }
}
