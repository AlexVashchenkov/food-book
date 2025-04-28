export class Category {
  name: string;
  color: string;
  userId: number;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
