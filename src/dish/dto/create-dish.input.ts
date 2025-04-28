import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateDishInput {
  @Field({ description: 'Название блюда' })
  name: string;

  @Field({ description: 'Описание блюда' })
  description: string;

  @Field({ description: 'Время приготовления в минутах' })
  cookingTime: number;

  @Field({ description: 'Сложность приготовления' })
  difficulty: string;

  @Field(() => Int, { description: 'ID пользователя, создающего блюдо' })
  userId: number;

  @Field({ description: 'Название категории блюда' })
  category: string;

  @Field(() => [Int], { nullable: true, description: 'ID категорий блюда' })
  categoryIds?: number[];
} 