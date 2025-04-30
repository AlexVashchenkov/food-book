import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        age: Number(createUserDto.age),
        photo: createUserDto.photo,
        password: createUserDto.password,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name ?? existingUser.name,
        // eslint-disable-next-line no-constant-binary-expression
        age: Number(updateUserDto.age) ?? Number(existingUser.age),
        photo: updateUserDto.photo ?? existingUser.photo,
        password: updateUserDto.password ?? existingUser.password,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.$transaction(async (prisma) => {
      await prisma.recipe.deleteMany({
        where: {
          dish: {
            userId: id,
          },
        },
      });

      await prisma.dish.deleteMany({
        where: { userId: id },
      });

      await prisma.category.deleteMany({
        where: { userId: id },
      });

      return prisma.user.delete({
        where: { id },
      });
    });
  }

  async getUserDishes(userId: number, skip = 0, take = 10) {
    return this.prisma.dish.findMany({
      where: { userId },
      include: {
        category: true,
        ingredients: true,
      },
      skip,
      take,
    });
  }

  async getUserDish(userId: number, dishId: number) {
    await this.findOne(userId);

    const dish = await this.prisma.dish.findFirst({
      where: { userId, id: dishId },
      include: {
        category: true,
        ingredients: true,
      },
    });

    if (!dish) {
      throw new NotFoundException(
        `Блюдо с ID ${dishId} у пользователя с ID ${userId} не найдено`,
      );
    }

    return dish;
  }

  async getUserCategories(userId: number, skip = 0, take = 10) {
    await this.findOne(userId);

    return this.prisma.category.findMany({
      where: { userId },
      include: {
        dishes: true,
      },
      skip,
      take,
    });
  }

  async getUserCategory(userId: number, categoryId: number) {
    await this.findOne(userId);

    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
      include: {
        dishes: true,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Категория с ID ${categoryId} у пользователя с ID ${userId} не найдена`,
      );
    }

    return category;
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.user.findMany({
      skip,
      take,
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.user.count();
  }

  async findByEmail(email: string) {
    return this.prisma.user.findMany({ where: { name: email } });
  }
}
