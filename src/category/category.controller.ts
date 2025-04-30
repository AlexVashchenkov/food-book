import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Render('categories')
  async getAllCategories() {
    const categories = await this.categoryService.findAll();
    return { categories };
  }

  @Get('add')
  @Render('add-category')
  addCategoryForm() {
    return {};
  }

  @Get(':id')
  @Render('category')
  async getCategoryById(@Param('id') id: number) {
    const category = await this.categoryService.findOne(+id);
    return { category };
  }

  @Get(':id/edit')
  @Render('patch-category')
  async editCategoryForm(@Param('id') id: number) {
    const category = await this.categoryService.findOne(+id);
    return { category };
  }

  @Get(':id/dishes')
  async getCategoryDishes(
    @Param('id') id: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return await this.categoryService.getCategoryDishes(+id, +skip, +take);
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return { redirect: `/categories/${category.id}` };
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.update(+id, updateCategoryDto);
    return { redirect: `/categories/${id}` };
  }

  @Delete(':id')
  async removeCategory(@Param('id') id: string) {
    await this.categoryService.remove(+id);
    return { redirect: '/categories' };
  }
}
