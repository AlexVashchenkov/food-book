import { Dish } from '../../dish/entities/dish.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Recipe {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор рецепта' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '1.Нарежьте лук\n2. Обжарьте на слабом огне...',
    description: 'Пошаговая инструкция приготовления',
  })
  @Column({ type: 'text' })
  steps: string;

  @ApiProperty({
    example: 1,
    description: 'ID блюда, к которому относится рецепт',
  })
  @Column({ unique: true })
  dishId: number;

  @ApiProperty({
    type: () => Dish,
    description: 'Блюдо, к которому относится рецепт',
  })
  dish: Dish;
}
