import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class DishService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(createDishDto: CreateDishDto) {
    const photoPath = createDishDto.photo || 'default.jpg';

    if (Number(createDishDto.userId)) {
      createDishDto.userId = Number(createDishDto.userId);
    }

    await this.userService.findOne(createDishDto.userId);

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
        if (!name) continue;

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
        unit: di.ingredient.unit,
      })),
    };
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    const existingDish = await this.prisma.dish.findFirst({
      where: {
        id,
      },
      include: { category: true },
    });

    if (!existingDish) {
      throw new NotFoundException(`Dish ${id} not found`);
    }

    const dishName = Array.isArray(updateDishDto.name)
      ? updateDishDto.name[0]
      : updateDishDto.name;

    let categoryId = existingDish.categoryId;
    if (updateDishDto.category) {
      const categoryName = Array.isArray(updateDishDto.category)
        ? updateDishDto.category[0]
        : updateDishDto.category;

      let category = await this.prisma.category.findFirst({
        where: {
          name: categoryName,
          userId: existingDish.userId,
        },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: {
            name: categoryName,
            userId: existingDish.userId,
            color: '#ffffff',
          },
        });
      }
      categoryId = category.id;
    }

    const dish = await this.prisma.dish.update({
      where: { id },
      data: {
        name: dishName,
        categoryId,
        photo: updateDishDto.photo,
      },
    });

    if (updateDishDto.steps) {
      const steps = Array.isArray(updateDishDto.steps)
        ? updateDishDto.steps[0]
        : updateDishDto.steps;

      let recipe = await this.prisma.recipe.findFirst({
        where: {
          steps: steps,
        },
      });

      if (!recipe) {
        recipe = await this.prisma.recipe.create({
          data: {
            steps: steps,
            dishId: id,
          },
        });
      }

      await this.prisma.recipe.upsert({
        where: { dishId: id },
        update: { steps: updateDishDto.steps },
        create: { dishId: id, steps: updateDishDto.steps },
      });
    }

    if (updateDishDto.ingredients) {
      await this.prisma.dishIngredient.deleteMany({
        where: { dishId: id },
      });

      for (const { name, amount } of updateDishDto.ingredients) {
        if (!name) continue;

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

    return this.getDishById(id);
  }

  async remove(id: number) {
    const dish = await this.prisma.dish.findFirst({
      where: {
        id,
      },
    });

    if (!dish) {
      throw new NotFoundException(`Dish ${id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.recipe.deleteMany({ where: { dishId: id } });
      await tx.dishIngredient.deleteMany({ where: { dishId: id } });
      return tx.dish.delete({ where: { id } });
    });
  }

  async findAll() {
    return this.prisma.dish.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }

  async getDishCategory(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            user: true,
          },
        },
      },
    });

    return dish?.category ? dish.category : null;
  }

  async getDishIngredients(id: number, skip: number, take: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: {
          skip,
          take,
          include: {
            ingredient: true,
          },
        },
      },
    });

    return (
      dish?.ingredients.map((di) => ({
        ...di.ingredient,
        amount: di.amount,
      })) || []
    );
  }

  async getDishRecipe(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        recipe: true,
      },
    });

    return dish?.recipe;
  }

  async getDishUser(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    return dish?.user;
  }

  async findAllPaginated(skip: number, take: number) {
    return this.prisma.dish.findMany({
      skip,
      take,
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  async countAll() {
    return this.prisma.dish.count();
  }

  async findOne(id: number) {
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

    if (!dish) {
      throw new NotFoundException(`Dish ${id} not found`);
    }

    return dish;
  }

  async getUserDishes(userId: number) {
    return this.prisma.dish.findMany({
      where: { userId },
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
  }

  async getUserDish(userId: number, id: number) {
    const dish = await this.prisma.dish.findFirst({
      where: {
        id,
        userId,
      },
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
        unit: di.ingredient.unit,
      })),
    };
  }
}
