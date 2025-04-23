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
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id: id },
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

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

  async getUserDishes(userId: number) {
    return this.prisma.dish.findMany({
      where: { userId: userId },
      include: {
        category: true,
        ingredients: true,
      },
    });
  }

  async getUserDish(userId: number, dishId: number) {
    return this.prisma.dish.findMany({
      where: { userId: userId, id: dishId },
      include: {
        category: true,
        ingredients: true,
      },
    });
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

  async getUserCategories(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
      include: {
        dishes: true,
      },
    });
  }

  async getUserCategory(userId: number, categoryId: number) {
    return this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
      include: {
        dishes: true,
      },
    });
  }
}
