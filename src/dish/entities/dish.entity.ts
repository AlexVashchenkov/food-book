import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { DishIngredient } from '../../ingredient/entities/dish-ingredient.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

export class Dish {
  id: number;
  name: string;
  photo: string | null;
  categoryId: number;
  userId: number;

  category: Category;
  user: User;
  recipe?: Recipe;
  dishIngredients?: DishIngredient[];

  constructor(data: Partial<Dish> = {}) {
    Object.assign(this, data);
  }
}
