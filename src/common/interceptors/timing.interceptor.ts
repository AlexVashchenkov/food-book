import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const requestType = context.getType();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const elapsedTime = Date.now() - start;

          if (requestType === 'http') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = context.switchToHttp().getResponse();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
          } else {
            try {
              const gqlContext = GqlExecutionContext.create(context);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const ctx = gqlContext.getContext();
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (ctx?.res) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                ctx.res.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              // Not a GraphQL request, ignore
            }
          }

          // Add timing to response data
          if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
              data.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                  item.serverProcessingTime = elapsedTime;
                }
              });
            } else {
              data.serverProcessingTime = elapsedTime;
            }
          }
        },
        error: (error) => {
          const elapsedTime = Date.now() - start;

          if (requestType === 'http') {
            const response = context.switchToHttp().getResponse();
            response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
          } else {
            try {
              const gqlContext = GqlExecutionContext.create(context);
              const ctx = gqlContext.getContext();
              if (ctx?.res) {
                ctx.res.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
              }
            } catch (e) {
              // Not a GraphQL request, ignore
            }
          }
        }
      })
    );
  }
}
