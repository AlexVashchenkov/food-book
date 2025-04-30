import { Controller, Get, Render } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  @ApiBearerAuth()
  async getIndexPage() {}
}
