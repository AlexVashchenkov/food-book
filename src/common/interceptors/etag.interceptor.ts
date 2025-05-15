import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((body) => {
        const etag = crypto
          .createHash('md5')
          .update(JSON.stringify(body))
          .digest('hex');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        res.setHeader('ETag', etag);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (req.headers['if-none-match'] === etag) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
          res.status(304).end();
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return body;
      }),
    );
  }
}
