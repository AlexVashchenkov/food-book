import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateRecipeInput } from './create-recipe.input';

@InputType()
export class UpdateRecipeInput extends PartialType(CreateRecipeInput) {
  @Field(() => Int, { description: 'Уникальный идентификатор рецепта' })
  id: number;
} 