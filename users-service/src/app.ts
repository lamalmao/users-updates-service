import { NestFactory } from '@nestjs/core';
import { AppModule } from './services/app.module.js';

async function boostrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

boostrap();
