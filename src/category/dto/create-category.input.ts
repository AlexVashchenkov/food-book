import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field({ description: 'Название категории' })
  name: string;

  @Field({ description: 'Описание категории' })
  description: string;

  @Field(() => Int, { description: 'ID пользователя, создающего категорию' })
  userId: number;

  @Field({ description: 'Цвет категории' })
  color: string;
}
