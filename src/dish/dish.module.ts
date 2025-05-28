import { Module } from '@nestjs/common';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { DishResolver } from './dish.resolver';
import { DishApiController } from './dish.api.controller';
import { StorageService } from '../../storage/storage.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [DishController, DishApiController],
  providers: [DishService, UserService, DishResolver, StorageService],
  imports: [PrismaModule, CacheModule.register()],
})
export class DishModule {}
