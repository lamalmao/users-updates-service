import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaExtendedClient } from '../prisma.service.js';
import { CustomPrismaService } from 'nestjs-prisma';
import { UpdatesService } from '../updates.service.js';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<PrismaExtendedClient>
  ) {}

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where
    });
  }

  async findUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.client.user.findMany(params);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.client.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.client.user.update(params);
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.client.user.delete({ where });
  }
}
