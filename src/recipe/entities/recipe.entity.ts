import { Dish } from '../../dish/entities/dish.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  steps: string;

  @Column({ unique: true })
  dishId: number;

  dish: Dish;
}
