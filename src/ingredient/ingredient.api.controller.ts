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
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Ingredient } from './entities/ingredient.entity';

@ApiTags('Ingredients')
@Controller('api/ingredients')
export class IngredientApiController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех ингредиентов (с пагинацией)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список ингредиентов получен успешно',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;

    const ingredients = await this.ingredientService.findAllPaginated(
      skip,
      take,
    );
    const total = await this.ingredientService.countAll();

    const baseUrl = '/api/ingredients';
    const links: string[] = [];

    if (skip + take < total) {
      links.push(`<${baseUrl}?page=${+page + 1}&limit=${take}>; rel="next"`);
    }
    if (+page > 1) {
      links.push(`<${baseUrl}?page=${+page - 1}&limit=${take}>; rel="prev"`);
    }

    res.setHeader('Link', links.join(', '));
    return res.status(HttpStatus.OK).json(ingredients);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ингредиент по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ингредиент найден',
    type: Ingredient,
  })
  @ApiResponse({ status: 404, description: 'Ингредиент не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать ингредиент' })
  @ApiBody({ type: CreateIngredientDto })
  @ApiResponse({ status: 201, description: 'Ингредиент создан' })
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(createIngredientDto);
    return {
      message: 'Ингредиент успешно создан',
      ingredient,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ингредиент по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateIngredientDto })
  @ApiResponse({ status: 200, description: 'Ингредиент обновлён' })
  @ApiResponse({ status: 404, description: 'Ингредиент не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const updated = await this.ingredientService.update(
      id,
      updateIngredientDto,
    );
    return {
      message: 'Ингредиент успешно обновлён',
      ingredient: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить ингредиент по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Ингредиент удалён' })
  @ApiResponse({ status: 404, description: 'Ингредиент не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ingredientService.remove(id);
  }

  @Get(':ingredientId/dishes')
  @ApiOperation({ summary: 'Получить все блюда с данным ингредиентом' })
  @ApiParam({ name: 'ingredientId', type: Number })
  async getIngredientDishes(
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    const dishes = await this.ingredientService.getIngredientDishes(
      ingredientId,
      +skip,
      +take,
    );
    return dishes;
  }
}
