import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeApiController } from './recipe.api.controller';
import { RecipeResolver } from './recipe.resolver';

@Module({
  controllers: [RecipeController, RecipeApiController],
  providers: [RecipeService, RecipeResolver],
})
export class RecipeModule {}
