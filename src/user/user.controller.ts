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
import { UserService } from './user.service';
import { Prisma, User as UserModel } from '../../generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotFoundException } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    const user = await this.userService.getUserById({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
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
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userService.deleteUser({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
