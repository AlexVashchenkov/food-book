import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field(() => Int)
  age: number;

  @Field()
  password: string;

  @Field({ nullable: true })
  photo?: string;
}
