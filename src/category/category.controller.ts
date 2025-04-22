import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
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

  @Get(':id/dish')
  @Render('dishes')
  async getCategoryDishes(@Param('id') id: number) {
    const dishes = await this.categoryService.getCategoryDishes(+id);
    return { dishes };
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
    console.log('DTO:', updateCategoryDto);
    await this.categoryService.update(+id, updateCategoryDto);
    return { redirect: `/categories/${id}` };
  }

  @Delete(':id')
  async removeCategory(@Param('id') id: string) {
    await this.categoryService.remove(+id);
    return { redirect: '/categories' };
  }
}
