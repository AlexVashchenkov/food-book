import { Module } from '@nestjs/common';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';

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
  ],
})
export class AppModule {}
