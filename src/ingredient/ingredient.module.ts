import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { IngredientApiController } from './ingredient.api.controller';

@Module({
  controllers: [IngredientController, IngredientApiController],
  providers: [IngredientService],
})
export class IngredientModule {}
