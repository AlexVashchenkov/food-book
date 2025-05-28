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
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @Render('ingredients')
  async getAllIngredients() {
    const ingredients = await this.ingredientService.findAll();
    return { ingredients };
  }

  @Get('add')
  @Render('add-ingredient')
  addIngredientForm() {
    return {};
  }

  @Get(':id')
  @Render('ingredient')
  async getIngredientById(@Param('id') id: number) {
    const ingredient = await this.ingredientService.findOne(+id);
    return { ingredient };
  }

  @Get(':id/edit')
  @Render('patch-ingredient')
  async editIngredientForm(@Param('id') id: number) {
    const ingredient = await this.ingredientService.findOne(+id);
    return { ingredient };
  }

  @Post()
  async createIngredient(@Body() createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(createIngredientDto);
    return { redirect: `/ingredients/${ingredient.id}` };
  }

  @Patch(':id')
  async updateIngredient(
    @Param('id') id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.ingredientService.update(id, updateIngredientDto);
    return { redirect: `/ingredients/${id}` };
  }

  @Delete(':id')
  async removeIngredient(@Param('id') id: string) {
    await this.ingredientService.remove(+id);
    return { redirect: '/ingredients' };
  }
}
