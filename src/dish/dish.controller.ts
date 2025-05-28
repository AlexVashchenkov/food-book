import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { CACHE_MANAGER, CacheInterceptor, Cache } from '@nestjs/cache-manager';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';
import { CacheControlInterceptor } from '../common/interceptors/cache-control.interceptor';

@Controller('dishes')
@UseInterceptors(CacheInterceptor, EtagInterceptor, CacheControlInterceptor)
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
  @UseInterceptors(CacheInterceptor)
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
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDishDto = new UpdateDishDto();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    updateDishDto.name = body.name;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    updateDishDto.steps = body.steps;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    updateDishDto.category = body.category;

    if (file) {
      const photoUpload = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      updateDishDto.photo = photoUpload.location;

      const dish = await this.dishService.findOne(+id);
      if (dish.photo) {
        const key = dish.photo?.split('/').pop();
        if (key) {
          await this.storageService.deleteFile('is-web-labs-bucket', key);
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      updateDishDto.photo = body.currentPhoto;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (body.ingredients) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        updateDishDto.ingredients = JSON.parse(body.ingredients);
      } catch (e) {
        console.error('Error parsing ingredients', e);
      }
    }

    await this.dishService.update(+id, updateDishDto);
    await this.cacheManager.del(`dish:${id}`);
    return { redirect: `/dishes/${id}` };
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('photo'))
  async createDish(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const photoUpload = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      createDishDto.photo = photoUpload.location;
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
      await this.cacheManager.del(`dish:${id}`);
      return { redirect: '/dishes' };
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { error: error || 'Failed to delete dish' };
    }
  }
}
