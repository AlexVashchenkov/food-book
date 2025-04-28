import { Module } from '@nestjs/common';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  controllers: [],
  providers: [],
  imports: [
    DishModule,
    PrismaModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
  ],
})
export class AppModule {}
