import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from '../../category/entities/category.graphql.entity';
import { Dish } from '../../dish/entities/dish.graphql.entity';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'Уникальный идентификатор пользователя' })
  id: number;

  @Field({ description: 'Имя пользователя' })
  name: string;

  @Field(() => Int, { description: 'Возраст пользователя' })
  age: number;

  @Field({ description: 'Пароль пользователя' })
  password: string;

  @Field({
    nullable: true,
    description: 'Ссылка на фото пользователя (необязательно)',
  })
  photo?: string;

  @Field(() => [Category], {
    nullable: true,
    description: 'Категории пользователя',
  })
  categories?: Category[];

  @Field(() => [Dish], { nullable: true, description: 'Блюда пользователя' })
  dishes?: Dish[];
}
