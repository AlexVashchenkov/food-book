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
import { DishService } from './dish.service';
import { Dish } from './entities/dish.graphql.entity';
import { CreateDishInput } from './dto/create-dish.input';
import { UpdateDishInput } from './dto/update-dish.input';
import { User } from '../user/entities/user.graphql.entity';
import { Category } from '../category/entities/category.graphql.entity';
import { Recipe } from '../recipe/entities/recipe.graphql.entity';
import { Ingredient } from '../ingredient/entities/ingredient.graphql.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ComplexityGuard } from '../common/guards/complexity.guard';

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Query(() => [Dish], { name: 'dishes', complexity: 5 })
  @UseGuards(ComplexityGuard)
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.dishService.getAllDishes();
  }

  @Query(() => Dish, { name: 'dish', complexity: 3 })
  @UseGuards(ComplexityGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.dishService.getDishById(id);
  }

  @Mutation(() => Dish, { complexity: 5 })
  createDish(@Args('createDishInput') createDishInput: CreateDishInput) {
    return this.dishService.create(createDishInput);
  }

  @Mutation(() => Dish, { complexity: 5 })
  updateDish(@Args('updateDishInput') updateDishInput: UpdateDishInput) {
    return this.dishService.update(updateDishInput.id, updateDishInput);
  }

  @Mutation(() => Boolean, { complexity: 3 })
  async removeDish(@Args('id', { type: () => Int }) id: number) {
    await this.dishService.remove(id);
    return true;
  }

  @ResolveField(() => User)
  async user(@Parent() dish: Dish) {
    return this.dishService.getDishUser(dish.id);
  }

  @ResolveField(() => [Category], {
    complexity: ({ args }) => 1 + args.limit,
  })
  async categories(
    @Parent() dish: Dish,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.dishService.getDishCategories(dish.id, offset, limit);
  }

  @ResolveField(() => Recipe)
  async recipe(@Parent() dish: Dish) {
    return this.dishService.getDishRecipe(dish.id);
  }

  @ResolveField(() => [Ingredient], {
    complexity: ({ args }) => 1 + args.limit,
  })
  async ingredients(
    @Parent() dish: Dish,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.dishService.getDishIngredients(dish.id, offset, limit);
  }
}
