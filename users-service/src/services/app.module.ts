import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { PrismaExtendedClientConfigService } from './prisma.service.js';
import { CustomPrismaModule, PrismaService } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UpdatesService } from './updates.service.js';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useClass: PrismaExtendedClientConfigService
    }),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UpdatesService]
})
export class AppModule {}
