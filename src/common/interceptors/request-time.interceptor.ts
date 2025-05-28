import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    let response: any;

    if (context.getType() === 'http') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      response = context.switchToHttp().getResponse();
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (context.getType() === 'graphql') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const gqlCtx = GqlExecutionContext.create(context).getContext();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        response = gqlCtx.res;
      }
    }

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        if (
          response &&
          typeof response.setHeader === 'function' &&
          !response.headersSent
        ) {
          response.setHeader('X-Elapsed-Time', `${elapsed}ms`);
        }
      }),
    );
  }
}
