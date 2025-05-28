import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { IngredientApiController } from './ingredient.api.controller';
import { IngredientResolver } from './ingredient.resolver';

@Module({
  controllers: [IngredientController, IngredientApiController],
  providers: [IngredientService, IngredientResolver],
})
export class IngredientModule {}
