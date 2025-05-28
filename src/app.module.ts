import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ElapsedTimeInterceptor } from './common/interceptors/request-time.interceptor';
import { StorageModule } from '../storage/storage.module';
import { AppController } from './app.controller';
import { TimingMiddleware } from './common/interceptors/timing.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ElapsedTimeInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // доступно везде
    }),
    StorageModule,
    DishModule,
    PrismaModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,
    AppModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimingMiddleware).forRoutes('*');
  }
}
