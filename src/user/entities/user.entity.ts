import { Dish } from '../../dish/entities/dish.entity';
import { Category } from '../../category/entities/category.entity';

export class User {
  id: number;
  name: string;
  age: number;
  password: string;
  photo: string | null;
  categories?: Category[];
  dishes?: Dish[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
