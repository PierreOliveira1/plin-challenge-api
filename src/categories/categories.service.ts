import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao criar categoria',
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

  async findAll(page = 1, limit = 10) {
    try {
      const totalCount = await this.prisma.category.count();
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;
      const take = limit;

      const categories = await this.prisma.category.findMany({
        skip,
        take,
      });

      const nextPage = page < totalPages ? page + 1 : null;

      return {
        totalPages,
        currentPage: page,
        nextPage,
        data: categories,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar categorias',
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
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              urlImage: true,
            },
          },
        },
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar categoria',
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updated = await this.prisma.category.update({
        data: {
          name: updateCategoryDto.name,
        },
        where: { id },
      });

      return updated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar categoria',
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
      const categoryAlreadyExists = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!categoryAlreadyExists) {
        throw new HttpException(
          {
            message: 'Esta categoria não existe',
          },
          404,
        );
      }

      await this.prisma.category.delete({ where: { id } });

      return {
        message: 'Categoria deletada com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao deletar categoria',
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
