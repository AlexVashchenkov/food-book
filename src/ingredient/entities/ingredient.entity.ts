import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Dish } from '../../dish/entities/dish.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column({ nullable: true })
  calories: number;

  @Column({ nullable: true })
  photo: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToMany(() => Dish, (dish) => dish.ingredients)
  dishes: Dish[];
}
