export class Category {
  name: string;
  color: string;
  userId: number;

  //Relations

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
