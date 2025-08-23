import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('json', { limit: '50mb' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  app.set('trust proxy', true);

  await app.listen(3000);
}
void bootstrap();
