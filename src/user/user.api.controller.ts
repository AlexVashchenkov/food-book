import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  Res,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей (с пагинацией)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Список получен успешно',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    const take = Math.min(+limit, 50);
    const skip = (+page - 1) * take;
    const users = await this.userService.findAllPaginated(skip, take);
    const total = await this.userService.countAll();

    const baseUrl = '/api/users';
    const links: string[] = [];

    if (skip + take < total) {
      links.push(`<${baseUrl}?page=${+page + 1}&limit=${take}>; rel="next"`);
    }
    if (+page > 1) {
      links.push(`<${baseUrl}?page=${+page - 1}&limit=${take}>; rel="prev"`);
    }

    res.setHeader('Link', links.join(', '));
    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'Пользователь создан успешно',
      user,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return {
      message: 'Пользователь успешно обновлён',
      user: updatedUser,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id);
  }

  @Get(':userId/dishes')
  @ApiOperation({ summary: 'Получить все блюда пользователя' })
  @ApiParam({ name: 'userId', type: Number })
  async getUserDishes(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserDishes(userId);
  }

  @Get(':userId/dishes/:dishId')
  @ApiOperation({ summary: 'Получить конкретное блюдо пользователя' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'dishId', type: Number })
  async getUserDish(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('dishId', ParseIntPipe) dishId: number,
  ) {
    return this.userService.getUserDish(userId, dishId);
  }

  @Get(':userId/categories')
  @ApiOperation({ summary: 'Получить все категории блюд у пользователя' })
  @ApiParam({ name: 'userId', type: Number })
  async getUserCategories(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserCategories(userId);
  }

  @Get(':userId/categories/:categoryId')
  @ApiOperation({ summary: 'Получить конкретную категорию блюд пользователя' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'categoryId', type: Number })
  async getUserCategory(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.userService.getUserCategory(userId, categoryId);
  }
}
