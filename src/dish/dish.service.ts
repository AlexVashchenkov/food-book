import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  async create(createDishDto: CreateDishDto, photoFile?: Express.Multer.File) {
    const photoPath = photoFile ? photoFile.filename : 'default.jpg';
    if (Number(createDishDto.userId)) {
      createDishDto.userId = Number(createDishDto.userId);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createDishDto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    let category = await this.prisma.category.findFirst({
      where: {
        name: createDishDto.category,
        userId: createDishDto.userId,
      },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: createDishDto.category,
          userId: createDishDto.userId,
          color: '#ffffff',
        },
      });
    }

    const dish = await this.prisma.dish.create({
      data: {
        name: createDishDto.name,
        photo: photoPath,
        userId: createDishDto.userId,
        categoryId: category.id,
      },
    });

    if (createDishDto.steps) {
      await this.prisma.recipe.create({
        data: {
          dishId: dish.id,
          steps: createDishDto.steps,
        },
      });
    }

    if (createDishDto.ingredients?.length) {
      for (const { name, amount } of createDishDto.ingredients) {
        if (!name) continue; // или выбрось ошибку

        let ingredient = await this.prisma.ingredient.findFirst({
          where: { name },
        });

        if (!ingredient) {
          ingredient = await this.prisma.ingredient.create({
            data: { name, unit: 'шт' },
          });
        }

        await this.prisma.dishIngredient.create({
          data: {
            dishId: dish.id,
            ingredientId: ingredient.id,
            amount,
          },
        });
      }
    }

    return dish;
  }

  async getDishById(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
        recipe: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!dish) throw new NotFoundException(`Dish ${id} not found`);

    return {
      id: dish.id,
      name: dish.name,
      photo: dish.photo,
      category: dish.category,
      user: dish.user,
      recipe: dish.recipe,
      ingredients: dish.ingredients.map((di) => ({
        name: di.ingredient.name,
        amount: di.amount,
      })),
    };
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    const dish = await this.prisma.dish.update({
      where: { id },
      data: {
        name: updateDishDto.name,
        categoryId: updateDishDto.categoryId,
        photo: updateDishDto.photo,
      },
    });

    if (updateDishDto.steps) {
      await this.prisma.recipe.upsert({
        where: { dishId: id },
        update: { steps: updateDishDto.steps },
        create: { dishId: id, steps: updateDishDto.steps },
      });
    }

    if (updateDishDto.ingredients?.length) {
      await this.prisma.dishIngredient.deleteMany({
        where: { dishId: id },
      });

      for (const { name, amount } of updateDishDto.ingredients) {
        let ingredient = await this.prisma.ingredient.findFirst({
          where: { name },
        });

        if (!ingredient) {
          ingredient = await this.prisma.ingredient.create({
            data: { name, unit: 'шт' },
          });
        }

        await this.prisma.dishIngredient.create({
          data: {
            dishId: id,
            ingredientId: ingredient.id,
            amount,
          },
        });
      }
    }

    return dish;
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.recipe.deleteMany({ where: { dishId: id } });
      await tx.dishIngredient.deleteMany({ where: { dishId: id } });
      return tx.dish.delete({ where: { id } });
    });
  }

  async getAllDishes() {
    return this.prisma.dish.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }
}
