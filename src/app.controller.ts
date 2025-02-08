import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/world')
  getPisya(): string {
    return this.appService.getWorld();
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
