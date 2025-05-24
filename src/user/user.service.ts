import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  @Inject()
  private readonly prisma: PrismaService;

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    const saltOrRounds = 10;
    if (data.password && typeof data.password === 'string') {
      const hashPasswarod = await bcrypt.hash(data.password, saltOrRounds);
      data.password = hashPasswarod;
    }

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async getUserById(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        address: true,
      },
    });
  }

  async getAllUsers(params: {
    skip?: number; //skip = (página - 1) * take (paginação)
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const saltOrRounds = 10;
    const hashPasswarod = await bcrypt.hash(data.password, saltOrRounds);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPasswarod,
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
