import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Dish } from '../../dish/entities/dish.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  steps: string;

  @OneToOne(() => Dish, (dish) => dish.recipe)
  @JoinColumn()
  dish_Id: number;
}
