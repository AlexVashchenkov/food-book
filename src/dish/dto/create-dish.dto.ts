export class CreateDishDto {
  name: string;
  category: string;
  userId: number;
  steps?: string;
  photo?: string;
  ingredients?: {
    name: string;
    amount: number;
  }[];
}
