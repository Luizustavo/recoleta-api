import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateWasteDto } from './dto/create-waste.dto';
import { UpdateWasteDto } from './dto/update-waste.dto';

@Injectable()
export class WasteService {
  constructor(private readonly prisma: PrismaService) {}

  private mapWasteTypeFromPortuguese(tipo: string): string {
    const mapping: Record<string, string> = {
      // Versões com acento
      eletrônicos: 'ELECTRONICS',
      orgânicos: 'ORGANIC',
      plásticos: 'PLASTIC',
      têxteis: 'TEXTILE',
      // Versões sem acento (compatibilidade)
      eletronicos: 'ELECTRONICS',
      organicos: 'ORGANIC',
      plasticos: 'PLASTIC',
      texteis: 'TEXTILE',
      // Outros tipos
      papel: 'PAPER',
      vidros: 'GLASS',
      metais: 'METAL',
      madeira: 'WOOD',
      diversos: 'MISCELLANEOUS',
    };
    return mapping[tipo] || 'MISCELLANEOUS';
  }

  private mapWasteUnitFromPortuguese(unidade: string): string {
    const mapping: Record<string, string> = {
      kg: 'KG',
      litros: 'LITERS',
      unidades: 'UNITS',
    };
    return mapping[unidade] || 'UNITS';
  }

  private mapWasteConditionFromPortuguese(condicao: string): string {
    const mapping: Record<string, string> = {
      novo: 'NEW',
      usado: 'USED',
      danificado: 'DAMAGED',
    };
    return mapping[condicao] || 'USED';
  }

  async createWaste(
    userId: string,
    createWasteDto: CreateWasteDto,
  ): Promise<any> {
    const { waste, address } = createWasteDto;

    // Primeiro, criar ou usar endereço existente
    let addressData = await this.prisma.address.findFirst({
      where: {
        userId,
        street: address.rua,
        city: address.cidade,
        state: address.estado,
        zipCode: address.cep,
      },
    });

    if (!addressData) {
      addressData = await this.prisma.address.create({
        data: {
          userId,
          street: address.rua,
          number: address.numero,
          complement: address.complemento,
          neighborhood: address.bairro,
          city: address.cidade,
          state: address.estado,
          zipCode: address.cep,
          reference: address.referencia,
          isMain: address.principal,
        },
      });
    }

    // Criar o resíduo
    const discardDateTime = new Date(
      `${waste.dataDescarte}T${waste.horaDescarte}:00`,
    );

    return await (this.prisma as any).waste.create({
      data: {
        userId,
        addressId: addressData.id,
        wasteType: this.mapWasteTypeFromPortuguese(waste.tipoResiduo) as any,
        weight: waste.peso,
        quantity: waste.quantidade,
        unit: this.mapWasteUnitFromPortuguese(waste.unidade) as any,
        condition: this.mapWasteConditionFromPortuguese(waste.condicao) as any,
        hasPackaging: waste.embalagem === 'sim',
        discardDate: discardDateTime,
        discardTime: waste.horaDescarte,
        additionalDescription: waste.descricaoAdicional,
        images: waste.imagens || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });
  }

  async getAllWastesByUser(userId: string): Promise<any[]> {
    return await (this.prisma as any).waste.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWasteById(id: string, userId: string): Promise<any | null> {
    return await (this.prisma as any).waste.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });
  }

  async updateWaste(
    id: string,
    userId: string,
    updateWasteDto: UpdateWasteDto,
  ): Promise<any> {
    const updateData: any = {};

    if (updateWasteDto.waste) {
      const { waste } = updateWasteDto;

      if (waste.tipoResiduo) {
        updateData.wasteType = this.mapWasteTypeFromPortuguese(
          waste.tipoResiduo,
        ) as any;
      }
      if (waste.peso !== undefined) updateData.weight = waste.peso;
      if (waste.quantidade !== undefined)
        updateData.quantity = waste.quantidade;
      if (waste.unidade) {
        updateData.unit = this.mapWasteUnitFromPortuguese(waste.unidade) as any;
      }
      if (waste.condicao) {
        updateData.condition = this.mapWasteConditionFromPortuguese(
          waste.condicao,
        ) as any;
      }
      if (waste.embalagem) {
        updateData.hasPackaging = waste.embalagem === 'sim';
      }
      if (waste.dataDescarte && waste.horaDescarte) {
        updateData.discardDate = new Date(
          `${waste.dataDescarte}T${waste.horaDescarte}:00`,
        );
        updateData.discardTime = waste.horaDescarte;
      }
      if (waste.descricaoAdicional !== undefined) {
        updateData.additionalDescription = waste.descricaoAdicional;
      }
      if (waste.imagens !== undefined) {
        updateData.images = waste.imagens;
      }
    }

    return await (this.prisma as any).waste.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });
  }

  async deleteWaste(id: string, userId: string): Promise<any> {
    return await (this.prisma as any).waste.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });
  }
}
