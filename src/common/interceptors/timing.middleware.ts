import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalEnd = res.end;

    res.end = function (...args: any[]) {
      const elapsed = Date.now() - start;

      try {
        if (!res.headersSent) {
          res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
        }
      } catch (e) {
        console.error('Failed to set X-Elapsed-Time:', e);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return originalEnd.apply(this, args);
    };

    next();
  }
}
