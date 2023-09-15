import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly bucketName: string;

  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_BUCKET_IMAGES_NAME');
  }

  async create(file: Express.Multer.File, createProductDto: CreateProductDto) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: createProductDto.categoryId,
        },
      });

      if (!category) {
        throw new HttpException(
          {
            message: 'Esta categoria não existe',
          },
          400,
        );
      }

      const createdProduct = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          urlImage: '',
          keyImage: '',
          category: {
            connect: {
              id: createProductDto.categoryId,
            },
          },
          menu: {
            connect: {
              id: createProductDto.menuId,
            },
          },
        },
      });

      const filenameSplit = file.originalname.split('.');
      const fileExtension = filenameSplit[filenameSplit.length - 1];
      const key = `products/${createdProduct.id}.${fileExtension}`;

      const urlImage = await this.s3.uploadFile(file, this.bucketName, key);

      const updatedProduct = await this.prisma.product.update({
        data: {
          urlImage: urlImage,
          keyImage: key,
        },
        where: {
          id: createdProduct.id,
        },
      });

      return updatedProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            message: 'Erro ao criar produto',
          },
          500,
        );
      }
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const totalCount = await this.prisma.product.count();
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;
      const take = limit;

      const products = await this.prisma.product.findMany({
        skip,
        take,
      });

      const nextPage = page < totalPages ? page + 1 : null;

      return {
        totalPages,
        currentPage: page,
        nextPage,
        data: products,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar produtos',
          },
          500,
        );
      }

      throw new HttpException(
        {
          message: 'Erro interno do servidor',
        },
        500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      return product;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar produto',
          },
          500,
        );
      }

      throw new HttpException(
        {
          message: 'Erro interno do servidor',
        },
        500,
      );
    }
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const productAlreadyExists = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!productAlreadyExists) {
        throw new HttpException(
          {
            message: 'Este produto não existe',
          },
          404,
        );
      }

      const data = {
        name: updateProductDto.name,
        description: updateProductDto.description,
        price: updateProductDto.price,
      };

      if (file) {
        const filenameSplit = file.originalname.split('.');
        const fileExtension = filenameSplit[filenameSplit.length - 1];

        const oldKeySplit = productAlreadyExists.keyImage.split('.');
        const oldExtension = oldKeySplit[oldKeySplit.length - 1];

        if (fileExtension !== oldExtension) {
          await this.s3.deleteFile(
            this.bucketName,
            productAlreadyExists.keyImage,
          );
        }

        const key = `products/${id}.${fileExtension}`;
        const urlImage = await this.s3.uploadFile(file, this.bucketName, key);

        Reflect.set(data, 'urlImage', urlImage);
        Reflect.set(data, 'keyImage', key);
      }

      if (updateProductDto.categoryId) {
        Reflect.set(data, 'category', {
          connect: {
            id: updateProductDto.categoryId,
          },
        });
      }

      if (updateProductDto.menuId) {
        Reflect.set(data, 'menu', {
          connect: {
            id: updateProductDto.menuId,
          },
        });
      }

      const updated = await this.prisma.product.update({
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          ...data,
        },
        where: { id },
      });

      return updated;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao atualizar produto',
          },
          500,
        );
      }

      throw new HttpException(
        {
          message: 'Erro interno do servidor',
        },
        500,
      );
    }
  }

  async remove(id: string) {
    try {
      const productAlreadyExists = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!productAlreadyExists) {
        throw new HttpException(
          {
            message: 'Este produto não existe',
          },
          404,
        );
      }

      await this.s3.deleteFile(this.bucketName, productAlreadyExists.keyImage);
      await this.prisma.product.delete({ where: { id } });

      return {
        message: 'Produto deletado com sucesso',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao deletar produto',
          },
          500,
        );
      }

      throw new HttpException(
        {
          message: 'Erro interno do servidor',
        },
        500,
      );
    }
  }
}
