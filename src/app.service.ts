import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWorld(): string {
    return 'World!';
  }

  getHello(): string {
    return 'Hello!';
  }
}
