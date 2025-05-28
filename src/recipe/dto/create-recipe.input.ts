import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateRecipeInput {
  @Field({ description: 'Название рецепта' })
  name: string;

  @Field({ description: 'Пошаговые инструкции приготовления' })
  instructions: string;

  @Field(() => Int, { description: 'Количество порций' })
  servings: number;

  @Field(() => Int, { description: 'ID блюда, к которому относится рецепт' })
  dishId: number;

  @Field({ description: 'Шаги приготовления' })
  steps: string;
} 