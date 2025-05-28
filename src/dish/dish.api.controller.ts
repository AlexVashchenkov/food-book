import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Res,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Dish } from './entities/dish.entity';

@ApiTags('Dishes')
@Controller('api/dishes')
export class DishApiController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех блюд (с пагинацией)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список блюд получен успешно',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;

    const dishes = await this.dishService.findAllPaginated(skip, take);
    const total = await this.dishService.countAll();

    const baseUrl = '/api/dishes';
    const links: string[] = [];

    if (skip + take < total) {
      links.push(`<${baseUrl}?page=${+page + 1}&limit=${take}>; rel="next"`);
    }
    if (+page > 1) {
      links.push(`<${baseUrl}?page=${+page - 1}&limit=${take}>; rel="prev"`);
    }

    res.setHeader('Link', links.join(', '));
    return res.status(HttpStatus.OK).json(dishes);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить блюдо по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Блюдо найдено',
    type: Dish,
  })
  @ApiResponse({ status: 404, description: 'Блюдо не найдено' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать блюдо' })
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({ status: 201, description: 'Блюдо создано' })
  async create(@Body() createDishDto: CreateDishDto) {
    const dish = await this.dishService.create(createDishDto);
    return {
      message: 'Блюдо успешно создано',
      dish,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить блюдо по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({ status: 200, description: 'Блюдо обновлено' })
  @ApiResponse({ status: 404, description: 'Блюдо не найдено' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    const updated = await this.dishService.update(id, updateDishDto);
    return {
      message: 'Блюдо успешно обновлено',
      dish: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить блюдо по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Блюдо удалено' })
  @ApiResponse({ status: 404, description: 'Блюдо не найдено' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.dishService.remove(id);
  }

  @Get(':dishId/ingredients')
  @ApiOperation({ summary: 'Получить все ингредиенты блюда' })
  @ApiParam({ name: 'dishId', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getDishIngredients(
    @Param('dishId', ParseIntPipe) dishId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;
    return this.dishService.getDishIngredients(dishId, skip, take);
  }

  @Get(':dishId/recipe')
  @ApiOperation({ summary: 'Получить рецепт блюда' })
  @ApiParam({ name: 'dishId', type: Number })
  @ApiResponse({ status: 200, description: 'Рецепт найден' })
  @ApiResponse({ status: 404, description: 'Рецепт не найден' })
  async getDishRecipe(@Param('dishId', ParseIntPipe) dishId: number) {
    return this.dishService.getDishRecipe(dishId);
  }
}
