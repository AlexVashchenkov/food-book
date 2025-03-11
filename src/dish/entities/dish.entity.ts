import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  photo: string;

  @ManyToOne(() => Category, (category) => category.id)
  categoryRelation: Category;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  @ManyToMany(() => Ingredient, (ingredient) => ingredient.dishes)
  @JoinTable()
  ingredients: Ingredient[];

  @OneToOne(() => Recipe, (recipe) => recipe.dish_Id)
  @JoinColumn()
  recipe: Recipe;
}
