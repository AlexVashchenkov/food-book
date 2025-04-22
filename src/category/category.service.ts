import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        dishes: {
          select: { id: true },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        dishes: true,
      },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        userId: Number(createCategoryDto.userId),
      },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name ?? existingCategory.name,
        color: updateCategoryDto.color ?? existingCategory.color,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryDishes(id: number) {
    return this.prisma.dish.findMany({
      where: { categoryId: id },
    });
  }
}
