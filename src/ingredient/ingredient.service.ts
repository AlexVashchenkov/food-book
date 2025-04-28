import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async create(createIngredientDto: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data: createIngredientDto,
    });
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return this.prisma.ingredient.update({
      where: { id: Number(id) },
      data: updateIngredientDto,
    });
  }

  async remove(id: number) {
    return this.prisma.ingredient.delete({
      where: { id },
    });
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.ingredient.findMany({
      skip,
      take,
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.ingredient.count();
  }

  async getIngredientDishes(id: number, skip: number, take: number) {
    const dishIngredients = await this.prisma.dishIngredient.findMany({
      where: { ingredientId: id },
      skip,
      take,
      include: {
        dish: true,
      },
    });

    return dishIngredients.map(di => di.dish);
  }
}
