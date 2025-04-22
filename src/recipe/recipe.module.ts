import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';

@Module({
  controllers: [],
  providers: [RecipeService],
})
export class RecipeModule {}
