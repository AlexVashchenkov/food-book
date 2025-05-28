import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.graphql.entity';
import { Category } from '../../category/entities/category.graphql.entity';
import { Recipe } from '../../recipe/entities/recipe.graphql.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.graphql.entity';

@ObjectType()
export class Dish {
  @Field(() => Int, { description: 'Уникальный идентификатор блюда' })
  id: number;

  @Field({ description: 'Название блюда' })
  name: string;

  @Field({ description: 'Описание блюда' })
  description: string;

  @Field({ description: 'Время приготовления в минутах' })
  cookingTime: number;

  @Field({ description: 'Сложность приготовления' })
  difficulty: string;

  @Field(() => User, { description: 'Пользователь, создавший блюдо' })
  user: User;

  @Field(() => [Category], { nullable: true, description: 'Категории блюда' })
  categories?: Category[];

  @Field(() => Recipe, { nullable: true, description: 'Рецепт блюда' })
  recipe?: Recipe;

  @Field(() => [Ingredient], { nullable: true, description: 'Ингредиенты блюда' })
  ingredients?: Ingredient[];
}
