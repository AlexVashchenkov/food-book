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
import { IngredientService } from './ingredient.service';
import { Ingredient } from './entities/ingredient.graphql.entity';
import { CreateIngredientInput } from './dto/create-ingredient.input';
import { UpdateIngredientInput } from './dto/update-ingredient.input';
import { Dish } from '../dish/entities/dish.graphql.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ComplexityGuard } from '../common/guards/complexity.guard';

@Resolver(() => Ingredient)
export class IngredientResolver {
  constructor(private readonly ingredientService: IngredientService) {}

  @Query(() => [Ingredient], { name: 'ingredients', complexity: 5 })
  @UseGuards(ComplexityGuard)
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.ingredientService.findAll();
  }

  @Query(() => Ingredient, { name: 'ingredient', complexity: 3 })
  @UseGuards(ComplexityGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ingredientService.findOne(id);
  }

  @Mutation(() => Ingredient, { complexity: 5 })
  createIngredient(
    @Args('createIngredientInput') createIngredientInput: CreateIngredientInput,
  ) {
    return this.ingredientService.create(createIngredientInput);
  }

  @Mutation(() => Ingredient, { complexity: 5 })
  updateIngredient(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ) {
    return this.ingredientService.update(
      updateIngredientInput.id,
      updateIngredientInput,
    );
  }

  @Mutation(() => Boolean, { complexity: 3 })
  async removeIngredient(@Args('id', { type: () => Int }) id: number) {
    await this.ingredientService.remove(id);
    return true;
  }

  @ResolveField(() => [Dish], {
    complexity: ({ args }) => 1 + args.limit,
  })
  async dishes(
    @Parent() ingredient: Ingredient,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.ingredientService.getIngredientDishes(
      ingredient.id,
      offset,
      limit,
    );
  }
}
