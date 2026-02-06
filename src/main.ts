// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     cors: true,
//     rawBody: true
//   }
//   );
//   await app.listen(process.env.Port ?? 5000)
//   console.log(`Server is running on port ${process.env.Port ?? 5000}`);
// }
// bootstrap();


////////////////////////////////////////
//support vercel deployment by converting it to serverless

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export async function createApp() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {
      cors: true,
      rawBody: true,
    },
  );

  await app.init();
  return server;
}
