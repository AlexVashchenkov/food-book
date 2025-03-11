import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Dish } from '../../dish/entities/dish.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToOne(() => Dish, (dish) => dish.category)
  dishes: Dish[];
}
