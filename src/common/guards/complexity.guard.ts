import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ComplexityGuard implements CanActivate {
  private readonly MAX_COMPLEXITY = 100;

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = gqlContext.getContext();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const complexity = request['graphqlComplexity'] ?? 0;

    if (complexity > this.MAX_COMPLEXITY) {
      throw new Error(
        `Сложность запроса ${complexity} превышает максимальную ${this.MAX_COMPLEXITY}`,
      );
    }

    return true;
  }
}
