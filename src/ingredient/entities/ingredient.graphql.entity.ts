import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Dish } from '../../dish/entities/dish.graphql.entity';

@ObjectType()
export class Ingredient {
  @Field(() => Int, { description: 'Уникальный идентификатор ингредиента' })
  id: number;

  @Field({ description: 'Название ингредиента' })
  name: string;

  @Field({ description: 'Количество ингредиента' })
  amount: string;

  @Field({ description: 'Единица измерения' })
  unit: string;

  @Field({ description: 'Калории (на 100 г.)' })
  calories?: number;

  @Field({ description: 'Фото ингредиента' })
  photo?: string;

  @Field(() => [Dish], {
    description: 'Блюда, в которых используется ингредиент',
  })
  dishes: Dish[];
}
