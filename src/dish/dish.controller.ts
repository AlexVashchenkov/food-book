import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from './dto/create-dish.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  @Render('dishes')
  async getAllDishes() {
    try {
      const dishes = await this.dishService.getAllDishes();
      return { dishes };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to fetch dish' };
    }
  }

  @Get('add')
  @Render('add-new-meal')
  createForm() {
    return {};
  }

  @Get(':id')
  @Render('meal')
  async getDishById(@Param('id', ParseIntPipe) id: number) {
    const meal = await this.dishService.getDishById(id);
    console.log('Dish:', meal); // Лог в консоль сервера
    return { meal: meal };
  }

  // Форма редактирования
  @Get(':id/edit')
  @Render('patch-meal')
  async editForm(@Param('id') id: number) {
    const dish = await this.dishService.getDishById(+id);
    return { dish: dish };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateDish(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateDishDto.photo = file.filename;
    }

    await this.dishService.update(+id, updateDishDto);
    return { redirect: `/dishes/${id}` };
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createDishDto.photo = file.filename;
    }

    const dish = await this.dishService.create(createDishDto);
    if (!dish) {
      return { success: false, redirect: `/dishes` };
    }
    return { success: false, redirect: `/dishes/${dish.id}` };
  }

  @Delete(':id')
  async removeDish(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.dishService.remove(id);
      return { redirect: '/dishes' };
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { error: error || 'Failed to delete dish' };
    }
  }
}
