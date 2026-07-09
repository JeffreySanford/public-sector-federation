import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgileController } from './agile.controller';
import { AgileService } from './agile.service';

@Module({
  controllers: [AgileController],
  providers: [AgileService, PrismaService],
})
export class AgileModule {}
