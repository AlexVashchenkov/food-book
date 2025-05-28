import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Хлеб' })
  readonly name: string;

  @ApiProperty({ example: ['.шт', '.мл', '.г', 'ч.л.', 'ст.л.'] })
  readonly unit: string;

  @ApiProperty({ example: 100 })
  readonly calories?: number;
}
