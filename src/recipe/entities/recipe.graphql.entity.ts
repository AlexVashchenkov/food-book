import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Dish } from '../../dish/entities/dish.graphql.entity';

@ObjectType()
export class Recipe {
  @Field(() => Int, { description: 'Уникальный идентификатор рецепта' })
  id: number;

  @Field({ description: 'Название рецепта' })
  name: string;

  @Field({ description: 'Пошаговые инструкции приготовления' })
  steps: string;

  @Field(() => Dish, { description: 'Блюдо, к которому относится рецепт' })
  dish: Dish;
}
