import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryUser(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    return category?.user;
  }

  async getCategoryDishes(id: number, skip: number, take: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        dishes: {
          skip,
          take,
          include: {
            user: true,
          },
        },
      },
    });

    return category?.dishes || [];
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.category.findMany({
      skip,
      take,
      include: {
        user: true,
        dishes: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async countAll() {
    return this.prisma.category.count();
  }
}
