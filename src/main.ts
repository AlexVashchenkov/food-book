import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ElapsedTimeInterceptor } from './common/interceptors/timing.interceptor';
import * as methodOverride from 'method-override';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('')
    .setDescription('The dishes API description')
    .setVersion('1.0')
    .addTag('dishes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');
  app.setBaseViewsDir([
    join(__dirname, '..', 'views'),
    join(__dirname, '..', 'views', 'dish'),
    join(__dirname, '..', 'views', 'user'),
    join(__dirname, '..', 'views', 'category'),
    join(__dirname, '..', 'views', 'ingredient'),
    join(__dirname, '..', 'views', 'recipe'),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(methodOverride('_method'));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Accept',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ElapsedTimeInterceptor());

  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
  const hbs = require('hbs');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  hbs.registerHelper('eq', function (arg1, arg2) {
    return arg1 == arg2;
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
