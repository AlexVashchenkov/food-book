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
import { UpdateDishDto } from './dto/update-dish.dto';
import { StorageService } from '../../storage/storage.service';

@Controller('dishes')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @Render('dishes')
  async getAllDishes() {
    try {
      const dishes = await this.dishService.findAll();
      return { dishes };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to fetch dishes' };
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
    const meal = await this.dishService.findOne(id);
    return { meal };
  }

  @Get(':id/edit')
  @Render('patch-meal')
  async editForm(@Param('id') id: number) {
    const dish = await this.dishService.findOne(+id);
    return { dish };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateDish(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDishDto = new UpdateDishDto();
    updateDishDto.name = body.name;
    updateDishDto.steps = body.steps;
    updateDishDto.category = body.category;

    if (file) {
      const photoUrl = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      updateDishDto.photo = photoUrl;

      const dish = await this.dishService.getUserDish(req.user.userId, +id);
      if (dish.photo) {
        const key = dish.photo?.split('/').pop();
        if (key) {
          await this.storageService.deleteFile('is-web-labs-bucket', key);
        }
      }
    } else {
      updateDishDto.photo = body.currentPhoto;
    }

    if (body.ingredients) {
      try {
        updateDishDto.ingredients = JSON.parse(body.ingredients);
      } catch (e) {
        console.error('Error parsing ingredients', e);
      }
    }

    await this.dishService.update(+id, updateDishDto);
    return { redirect: `/dishes/${id}` };
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('photo'))
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const photoUrl = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      createDishDto.photo = photoUrl;
    }

    const dish = await this.dishService.create(createDishDto);
    if (!dish) {
      return { success: false, redirect: `/dishes` };
    }
    return { success: true, redirect: `/dishes/${dish.id}` };
  }

  @Delete(':id')
  async removeDish(@Param('id', ParseIntPipe) id: number) {
    try {
      const dish = await this.dishService.findOne(id);

      if (dish.photo) {
        const key = dish.photo?.split('/').pop();
        if (key) {
          await this.storageService.deleteFile('is-web-labs-bucket', key);
        }
      }

      await this.dishService.remove(id);
      return { redirect: '/dishes' };
    } catch (error) {
      console.error(error);
      return { error: error || 'Failed to delete dish' };
    }
  }
}
