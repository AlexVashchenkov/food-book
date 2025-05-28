import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Info,
} from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { Recipe } from './entities/recipe.graphql.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { Dish } from '../dish/entities/dish.graphql.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ComplexityGuard } from '../common/guards/complexity.guard';

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(() => [Recipe], { name: 'recipes', complexity: 5 })
  @UseGuards(ComplexityGuard)
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.recipeService.findAll();
  }

  @Query(() => Recipe, { name: 'recipe', complexity: 3 })
  @UseGuards(ComplexityGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.recipeService.findOne(id);
  }

  @Mutation(() => Recipe, { complexity: 5 })
  createRecipe(
    @Args('createRecipeInput') createRecipeInput: CreateRecipeInput,
  ) {
    return this.recipeService.create(createRecipeInput);
  }

  @Mutation(() => Recipe, { complexity: 5 })
  updateRecipe(
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
  ) {
    return this.recipeService.update(updateRecipeInput.id, updateRecipeInput);
  }

  @Mutation(() => Boolean, { complexity: 3 })
  async removeRecipe(@Args('id', { type: () => Int }) id: number) {
    await this.recipeService.remove(id);
    return true;
  }

  @ResolveField(() => Dish)
  async dish(@Parent() recipe: Recipe) {
    return this.recipeService.getRecipeDish(recipe.id);
  }
}
