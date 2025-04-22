import { DishIngredient } from './dish-ingredient.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  unit: string; // Базовая единица измерения (г, мл, шт и т.д.)

  @Column({ nullable: true })
  calories?: number;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(
    () => DishIngredient,
    (dishIngredient) => dishIngredient.ingredient,
  )
  dishes: DishIngredient[];
}
