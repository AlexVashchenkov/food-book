import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.recipe.findMany({
      include: {
        dish: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        dish: {
          include: {
            category: true,
            ingredients: true,
          },
        },
      },
    });
  }

  async create(createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        steps: createRecipeDto.steps,
        dishId: createRecipeDto.dishId,
      },
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        steps: updateRecipeDto.steps,
        ...(updateRecipeDto.dishId && {
          dish: {
            connect: { id: updateRecipeDto.dishId },
          },
        }),
      },
      include: {
        dish: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.recipe.delete({
      where: { id },
    });
  }

  async getDishesWithoutRecipes() {
    const dishesWithRecipes = await this.prisma.recipe.findMany({
      select: {
        dishId: true,
      },
    });

    const dishIdsWithRecipes = dishesWithRecipes.map((r) => r.dishId);

    return this.prisma.dish.findMany({
      where: {
        id: {
          notIn: dishIdsWithRecipes,
        },
      },
    });
  }

  async getDish(dishId: number) {
    return this.prisma.dish.findUnique({
      where: {
        id: dishId,
      },
    });
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.recipe.findMany({
      skip,
      take,
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.recipe.count();
  }

  async getRecipeIngredients(id: number, skip: number, take: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        dish: {
          include: {
            ingredients: {
              skip,
              take,
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    return recipe?.dish.ingredients.map(di => ({
      ...di.ingredient,
      amount: di.amount,
    })) || [];
  }

  async getRecipeDish(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        dish: true,
      },
    });

    return recipe?.dish;
  }
}
