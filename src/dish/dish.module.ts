import { Module } from '@nestjs/common';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { DishResolver } from './dish.resolver';
import { DishApiController } from './dish.api.controller';
import { StorageService } from '../../storage/storage.service';

@Module({
  controllers: [DishController, DishApiController],
  providers: [DishService, UserService, DishResolver, StorageService],
  imports: [PrismaModule],
})
export class DishModule {}
