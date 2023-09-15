import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, S3Service],
})
export class ProductsModule {}
