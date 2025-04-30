import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @Render('recipes')
  async getAllRecipes() {
    const recipes = await this.recipeService.findAll();
    return { recipes };
  }

  @Get(':id')
  @Render('recipe')
  async getRecipeById(@Param('id') id: number) {
    const recipe = await this.recipeService.getRecipe(+id);
    if (!recipe) {
      throw new NotFoundException('Рецепт не найден');
    }
    console.log('Recipe: ', recipe);
    return { recipe };
  }

  @Delete(':id')
  @Render('recipes')
  async removeRecipe(@Param('id') id: number) {
    await this.recipeService.remove(id);
    return { redirect: '/recipes' };
  }
}
