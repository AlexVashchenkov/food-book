import { DishIngredient } from './dish-ingredient.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Ingredient {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор ингредиента',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Картофель', description: 'Название ингредиента' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    example: 'г.',
    description: 'Единица измерения (г., мл., шт., ст.л., ч.л., ...)',
  })
  @Column()
  unit: string;

  @ApiPropertyOptional({ example: 80, description: 'Калорийность (на 100г)' })
  @Column({ nullable: true })
  calories?: number;

  @ApiPropertyOptional({
    example: 'potato.jpg',
    description: 'Фото ингредиента',
  })
  @Column({ nullable: true })
  photo?: string;

  @ApiProperty({
    type: () => [DishIngredient],
    description: 'Связь с блюдами через промежуточную сущность',
  })
  @OneToMany(
    () => DishIngredient,
    (dishIngredient) => dishIngredient.ingredient,
  )
  dishes: DishIngredient[];
}
