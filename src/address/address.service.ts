import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: { sub: string }) {
    console.log('createAddressDto', createAddressDto);
    console.log('userId', userId);
    return await this.prisma.address.create({
      data: { ...createAddressDto, userId: userId.sub },
    });
  }

  async findAll() {
    return await this.prisma.address.findMany({});
  }

  async findOne(id: string) {
    return await this.prisma.address.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    return await this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.address.delete({
      where: { id },
    });
  }
}
