import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateIngredientInput } from './create-ingredient.input';

@InputType()
export class UpdateIngredientInput extends PartialType(CreateIngredientInput) {
  @Field(() => Int, { description: 'Уникальный идентификатор ингредиента' })
  id: number;
} 