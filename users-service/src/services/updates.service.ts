import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type Serializable = {
  [key: string]: string | number | Date | Array<Serializable> | Serializable;
};

export interface UpdateData {
  type: 'created' | 'updated' | 'deleted';
  date: Date;
  target: number;
  ip: string;
  data?: Serializable;
}

@Injectable()
export class UpdatesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async notify(update: UpdateData) {
    return this.httpService.post(
      `${this.configService.get<string>('UPDATES_SERVER_HOST')}/updates/create`,
      {
        update
      }
    );
  }
}
