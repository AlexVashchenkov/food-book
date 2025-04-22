import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Sse,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Observable } from 'rxjs';
import { EventEmitter2 } from 'eventemitter2';

@Controller('ingredients')
export class IngredientController {
  private readonly eventEmitter = new EventEmitter2();

  constructor(private readonly ingredientService: IngredientService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const handler = (data: any) => {
        const event = new MessageEvent('ingredient.changed', {
          data: JSON.stringify(data),
        });
        subscriber.next(event);
      };

      this.eventEmitter.on('ingredient.changed', handler);

      return () => {
        this.eventEmitter.off('ingredient.changed', handler);
      };
    });
  }

  @Get()
  @Render('ingredients')
  async getAllIngredients() {
    const ingredients = await this.ingredientService.findAll();
    return { ingredients };
  }

  @Get('add')
  @Render('add-ingredient')
  addIngredientForm() {
    return {};
  }

  @Get(':id')
  @Render('ingredient')
  async getIngredientById(@Param('id') id: number) {
    const ingredient = await this.ingredientService.findOne(+id);
    return { ingredient };
  }

  @Get(':id/edit')
  @Render('patch-ingredient')
  async editIngredientForm(@Param('id') id: number) {
    const ingredient = await this.ingredientService.findOne(+id);
    return { ingredient };
  }

  @Post()
  async createIngredient(@Body() createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(createIngredientDto);
    this.eventEmitter.emit('ingredient.changed', {
      type: 'CREATE',
      data: ingredient,
    });
    return { redirect: `/ingredients/${ingredient.id}` };
  }

  @Patch(':id')
  async updateIngredient(
    @Param('id') id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    const ingredient = await this.ingredientService.update(
      id,
      updateIngredientDto,
    );
    this.eventEmitter.emit('ingredient.changed', {
      type: 'UPDATE',
      data: ingredient,
    });
    return { redirect: `/ingredients/${id}` };
  }

  @Delete(':id')
  async removeIngredient(@Param('id') id: string) {
    await this.ingredientService.remove(+id);
    this.eventEmitter.emit('ingredient.changed', {
      type: 'DELETE',
      data: { id: +id },
    });
    return { redirect: '/ingredients' };
  }
}
