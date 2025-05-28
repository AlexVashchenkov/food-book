import { Ingredient } from './ingredient.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DishIngredient {
  @ApiProperty({ example: 1, description: 'ID блюда' })
  dishId: number;

  @ApiProperty({ example: 2, description: 'ID ингредиента' })
  ingredientId: number;

  @ApiProperty({
    example: 150,
    description: 'Количество ингредиента (в указанной единице)',
  })
  amount: number;

  @ApiProperty({ type: () => Ingredient, description: 'Данные об ингредиенте' })
  ingredient: Ingredient;
}
