import { Module } from '@nestjs/common';
import { AgileModule } from './modules/agile/agile.module';
import { HealthController } from './modules/health/health.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AgileModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
