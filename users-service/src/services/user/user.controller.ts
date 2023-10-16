import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { Prisma } from '@prisma/client';
import { Serializable, UpdatesService } from '../updates.service.js';
import { Request } from 'express';

function getIp(str: string): string | null {
  const data = /(((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4})/.exec(str);
  if (!data) {
    return null;
  }

  return data[0];
}

function getErrorData(error: PrismaClientKnownRequestError): HttpException {
  let message: string;
  let code: HttpStatus = HttpStatus.BAD_REQUEST;

  switch (error.code) {
    case 'P2000':
      message = 'Value too long';
      break;
    case 'P2002':
    case 'P2003':
      message = 'User already exists';
      break;
    case 'P2012':
    case 'P2013':
    case 'P2020':
      message = error.message;
      break;
    case 'P2005':
    case 'P2006':
      message = 'Wrong data type';
      break;
    default:
      message = 'Internal server error';
      code = HttpStatus.INTERNAL_SERVER_ERROR;
  }

  return new HttpException(message, code);
}

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly updates: UpdatesService
  ) {}

  @Get('/create/:name/:email/:number?')
  async createUser(
    @Req() request: Request,

    @Param('name') name: string,
    @Param('email') email: string,
    @Param('number', new ParseIntPipe({ optional: true })) number?: number
  ) {
    try {
      const user = await this.userService.createUser({
        name,
        email,
        number
      });

      this.updates
        .notify({
          type: 'created',
          date: new Date(),
          ip: getIp(request.socket.remoteAddress || '') || '0.0.0.0',
          target: user.id,
          data: user as Serializable
        })
        .catch(() => null);

      return {
        user
      };
    } catch (error) {
      throw getErrorData(error as PrismaClientKnownRequestError);
    }
  }

  @Post('/update/:id')
  async updateUser(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { update: Prisma.UserUpdateInput }
  ) {
    try {
      const user = await this.userService.updateUser({
        where: {
          id
        },
        data: body.update
      });

      this.updates
        .notify({
          type: 'updated',
          date: new Date(),
          ip: getIp(request.socket.remoteAddress || '') || '0.0.0.0',
          target: user.id,
          data: body.update as Serializable
        })
        .catch(() => null);

      return {
        user
      };
    } catch (error) {
      throw getErrorData(error as PrismaClientKnownRequestError);
    }
  }

  @Get('/delete/:id')
  async deleteUser(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number
  ) {
    try {
      const user = await this.userService.deleteUser({
        id
      });

      this.updates
        .notify({
          type: 'created',
          date: new Date(),
          ip: getIp(request.socket.remoteAddress || '') || '0.0.0.0',
          target: user.id
        })
        .catch(() => null);

      return {
        user
      };
    } catch (error) {
      throw getErrorData(error as PrismaClientKnownRequestError);
    }
  }

  @Get()
  async getUsers() {
    try {
      const users = await this.userService.findUsers({});

      return {
        users
      };
    } catch (error) {
      throw getErrorData(error as PrismaClientKnownRequestError);
    }
  }
}
