import { Module } from '@nestjs/common';
import { TestPerformanceService } from './test-performance.service';
import { TestPerformanceController } from './test-performance.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TestPerformanceService, PrismaService],
  controllers: [TestPerformanceController],
  exports: [TestPerformanceService],
})
export class TestPerformanceModule {}
