import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import { z } from 'zod';

const UserInput = z.object({
  email: z.string().regex(/[a-zA-Z0-9\.-_&]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}/),
  number: z.number().min(10000000).optional(),
  name: z.string().max(40)
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;

export const prismaExtendedClient = new PrismaClient().$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = UserInput.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = UserInput.partial().parse(args.data);
        return query(args);
      },
      updateMany({ args, query }) {
        args.data = UserInput.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }) {
        args.create = UserInput.parse(args.create);
        args.update = UserInput.partial().parse(args.update);
        return query(args);
      }
    }
  }
});

export type PrismaExtendedClient = typeof prismaExtendedClient;

@Injectable()
export class PrismaExtendedClientConfigService
  implements CustomPrismaClientFactory<PrismaExtendedClient>
{
  createPrismaClient(): PrismaExtendedClient {
    return prismaExtendedClient;
  }
}
