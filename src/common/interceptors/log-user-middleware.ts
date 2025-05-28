import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    if (path.startsWith('/edit') || path.startsWith('/add')) {
      const userAgent = req.get('User-Agent') || 'unknown';
      const ip =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const bodyCopy = { ...req.body };

      const log = {
        time: new Date().toISOString(),
        ip,
        path,
        method: req.method,
        userAgent,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: bodyCopy,
      };

      console.log('[USER REQUEST]', JSON.stringify(log));
    }
    next();
  }
}
