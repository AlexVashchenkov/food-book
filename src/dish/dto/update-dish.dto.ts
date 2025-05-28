export class UpdateDishDto {
  name?: string;
  category?: string;
  categoryId?: number;
  steps?: string;
  photo?: string;
  ingredients?: {
    name: string;
    amount: number;
  }[];
}
