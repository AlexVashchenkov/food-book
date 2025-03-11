import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  photo: string;

  @OneToMany(() => Category, (category) => category.user)
  @JoinColumn()
  categories: Category[];
}
