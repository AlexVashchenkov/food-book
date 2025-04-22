import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishModule } from './dish/dish.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DishController } from './dish/dish.controller';
import { DishService } from './dish/dish.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { IngredientService } from './ingredient/ingredient.service';
import { IngredientModule } from './ingredient/ingredient.module';
import { IngredientController } from './ingredient/ingredient.controller';
import { RecipeController } from './recipe/recipe.controller';
import { RecipeService } from './recipe/recipe.service';
import { RecipeModule } from './recipe/recipe.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [
    AppController,
    DishController,
    CategoryController,
    IngredientController,
    RecipeController,
    UserController,
  ],
  providers: [
    AppService,
    DishService,
    CategoryService,
    IngredientService,
    RecipeService,
    UserService,
  ],
  imports: [
    DishModule,
    PrismaModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
