import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  Res,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Recipe } from './entities/recipe.entity';
import { Dish } from '../dish/entities/dish.entity';

@ApiTags('Recipes')
@Controller('api/recipes')
export class RecipeApiController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список рецептов (с пагинацией)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Список рецептов получен успешно' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;

    const recipes = await this.recipeService.findAllPaginated(skip, take);
    const total = await this.recipeService.countAll();

    const baseUrl = '/api/recipes';
    const links: string[] = [];

    if (skip + take < total) {
      links.push(`<${baseUrl}?page=${+page + 1}&limit=${take}>; rel="next"`);
    }
    if (+page > 1) {
      links.push(`<${baseUrl}?page=${+page - 1}&limit=${take}>; rel="prev"`);
    }

    res.setHeader('Link', links.join(', '));
    return res.status(HttpStatus.OK).json(recipes);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить рецепт по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Рецепт найден', type: Recipe })
  @ApiResponse({ status: 404, description: 'Рецепт не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый рецепт' })
  @ApiBody({ type: CreateRecipeDto })
  @ApiResponse({ status: 201, description: 'Рецепт создан' })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const recipe = await this.recipeService.create(createRecipeDto);
    return {
      message: 'Рецепт успешно создан',
      recipe,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить рецепт по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRecipeDto })
  @ApiResponse({ status: 200, description: 'Рецепт обновлён' })
  @ApiResponse({ status: 404, description: 'Рецепт не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const updatedRecipe = await this.recipeService.update(id, updateRecipeDto);
    return {
      message: 'Рецепт успешно обновлён',
      recipe: updatedRecipe,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить рецепт по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Рецепт удалён' })
  @ApiResponse({ status: 404, description: 'Рецепт не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.recipeService.remove(id);
  }

  @Get(':recipeId/dish')
  @ApiOperation({ summary: 'Получить блюдо, связанное с рецептом' })
  @ApiParam({ name: 'recipeId', type: Number })
  @ApiResponse({ status: 200, description: 'Блюдо найдено', type: Dish })
  @ApiResponse({ status: 404, description: 'Рецепт или блюдо не найдено' })
  async getRecipeDish(@Param('recipeId', ParseIntPipe) recipeId: number) {
    const recipe = await this.recipeService.findOne(recipeId);
    if (!recipe) {
      return { message: 'Рецепт не найден' };
    }
    return this.recipeService.getDish(recipe.dishId);
  }
}
