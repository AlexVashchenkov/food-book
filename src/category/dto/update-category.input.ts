import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => Int, { description: 'Уникальный идентификатор категории' })
  id: number;

  @Field(() => Int, {
    description: 'ID пользователя, которому принадлежит категория',
  })
  usedId: number;
}
