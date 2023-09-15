import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidation } from './utils/zod-validation.utils';
import { PrismaService } from './prisma/prisma.service';
import { S3Service } from './s3/s3.service';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriesModule,
    MenuModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidation,
    },
    PrismaService,
    S3Service,
  ],
})
export class AppModule {}
