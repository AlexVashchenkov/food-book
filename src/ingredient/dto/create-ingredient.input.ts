import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateIngredientInput {
  @Field({ description: 'Название ингредиента' })
  name: string;

  @Field({ description: 'Количество ингредиента' })
  amount: string;

  @Field({ description: 'Единица измерения' })
  unit: string;

  @Field(() => [Int], { description: 'ID блюд, в которых используется ингредиент' })
  dishIds: number[];
}
