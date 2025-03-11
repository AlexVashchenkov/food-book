import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Регистрация частичных шаблонов
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
  const hbs = require('hbs');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
