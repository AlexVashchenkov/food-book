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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех категорий (с пагинацией)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список категорий получен успешно',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;

    const categories = await this.categoryService.findAllPaginated(skip, take);
    const total = await this.categoryService.countAll();

    const baseUrl = '/api/categories';
    const links: string[] = [];

    if (skip + take < total) {
      links.push(`<${baseUrl}?page=${+page + 1}&limit=${take}>; rel="next"`);
    }
    if (+page > 1) {
      links.push(`<${baseUrl}?page=${+page - 1}&limit=${take}>; rel="prev"`);
    }

    res.setHeader('Link', links.join(', '));
    return res.status(HttpStatus.OK).json(categories);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Категория найдена',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Категория создана' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return {
      message: 'Категория успешно создана',
      category,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updated = await this.categoryService.update(id, updateCategoryDto);
    return {
      message: 'Категория успешно обновлена',
      category: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Категория удалена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.remove(id);
  }

  @Get(':categoryId/dishes')
  @ApiOperation({ summary: 'Получить все блюда в данной категории' })
  @ApiParam({ name: 'categoryId', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCategoryDishes(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;
    return this.categoryService.getCategoryDishes(categoryId, skip, take);
  }
}
