import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../storage/storage.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @Render('users')
  async getAllUsers() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('add')
  @Render('add-user')
  addUserForm() {
    return {};
  }

  @Get(':id')
  @Render('user-profile')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }

  @Get(':id/edit')
  @Render('patch-user')
  async editUserForm(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return { user };
  }

  @Get(':id/dishes')
  @Render('dishes')
  async getUserDishes(@Param('id') id: string) {
    const dishes = await this.userService.getUserDishes(+id);
    return { dishes };
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const photoUpload = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      createUserDto.photo = photoUpload.location;
    }

    await this.userService.create(createUserDto);
    return res.redirect('/users');
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = await this.userService.findOne(+id);

    if (file) {
      const photoUpload = await this.storageService.uploadFile(
        file,
        'is-web-labs-bucket',
      );
      updateUserDto.photo = photoUpload.location;

      if (user.photo) {
        const key = user.photo?.split('/').pop();
        if (key) {
          await this.storageService.deleteFile('your-bucket-name', key);
        }
      }
    }

    await this.userService.update(+id, updateUserDto);
    return res.redirect('/users');
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(+id);

      if (user.photo) {
        const key = user.photo?.split('/').pop();
        if (key) {
          await this.storageService.deleteFile('your-bucket-name', key);
        }
      }

      await this.userService.remove(+id);
      return res.redirect('/users');
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).send('Error deleting user');
    }
  }

  @Get(':id/dishes/:dishId')
  @Render('meal')
  async getUserDish(
    @Param('id') userId: string,
    @Param('dishId') dishId: string,
  ) {
    const dish = await this.userService.getUserDish(+userId, +dishId);
    return { dish };
  }

  @Get(':id/categories')
  @Render('categories')
  async getUserCategories(@Param('id') userId: string) {
    const categories = await this.userService.getUserCategories(+userId);
    return { categories };
  }

  @Get(':id/categories/:categoryId')
  @Render('category')
  async getUserCategory(
    @Param('id') userId: string,
    @Param('categoryId') categoryId: string,
  ) {
    const category = await this.userService.getUserCategory(
      +userId,
      +categoryId,
    );
    return { category };
  }
}
