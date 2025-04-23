import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeApiController } from './recipe.api.controller';

@Module({
  controllers: [RecipeController, RecipeApiController],
  providers: [RecipeService],
})
export class RecipeModule {}
