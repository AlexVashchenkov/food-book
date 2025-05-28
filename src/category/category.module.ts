import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryResolver } from './category.resolver';
import { CategoryApiController } from './category.api.controller';

@Module({
  controllers: [CategoryController, CategoryApiController],
  providers: [CategoryService, PrismaService, CategoryResolver],
})
export class CategoryModule {}
