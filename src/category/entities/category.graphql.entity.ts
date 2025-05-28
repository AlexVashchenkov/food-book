import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.graphql.entity';
import { Dish } from '../../dish/entities/dish.graphql.entity';

@ObjectType()
export class Category {
  @Field(() => Int, { description: 'Уникальный идентификатор категории' })
  id: number;

  @Field({ description: 'Название категории' })
  name: string;

  @Field({ description: 'Описание категории' })
  description: string;

  @Field(() => User, { description: 'Пользователь, создавший категорию' })
  user: User;

  @Field(() => [Dish], { nullable: true, description: 'Блюда в категории' })
  dishes?: Dish[];
}
