import { Ingredient } from './ingredient.entity';

export class DishIngredient {
  dishId: number;
  ingredientId: number;
  amount: number;
  // Relation
  ingredient: Ingredient;
}
