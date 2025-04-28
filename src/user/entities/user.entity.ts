import { Dish } from '../../dish/entities/dish.entity';
import { Category } from '../../category/entities/category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ example: 25, description: 'Возраст пользователя' })
  age: number;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  password: string;

  @ApiPropertyOptional({
    example: 'photo.jpg',
    description: 'Ссылка на фото пользователя (необязательно)',
  })
  photo: string | null;

  @ApiPropertyOptional({
    type: () => [Category],
    description: 'Категории, созданные пользователем',
  })
  categories?: Category[];

  @ApiPropertyOptional({
    type: () => [Dish],
    description: 'Блюда, добавленные пользователем',
  })
  dishes?: Dish[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
