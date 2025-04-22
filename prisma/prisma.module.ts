import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делаем модуль глобальным
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Экспортируем PrismaService
})
export class PrismaModule {}
