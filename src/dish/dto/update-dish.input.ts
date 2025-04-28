import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateDishInput } from './create-dish.input';

@InputType()
export class UpdateDishInput extends PartialType(CreateDishInput) {
  @Field(() => Int, { description: 'Уникальный идентификатор блюда' })
  id: number;
} 