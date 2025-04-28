import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.photo = file.filename;
    }

    await this.userService.create(createUserDto);
    return res.redirect('/users');
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.photo = file.filename;
    }

    await this.userService.update(+id, updateUserDto);

    return res.redirect('/users');
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
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
