import { HttpException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      const menu = await this.prisma.menu.create({
        data: {
          shift: createMenuDto.shift,
        },
      });

      return menu;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao criar cardápio',
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
      const totalCount = await this.prisma.menu.count();
      const totalPages = Math.ceil(totalCount / limit);
      const skip = (page - 1) * limit;
      const take = limit;

      const menus = await this.prisma.menu.findMany({
        skip,
        take,
      });

      const nextPage = page < totalPages ? page + 1 : null;

      return {
        totalPages,
        currentPage: page,
        nextPage,
        data: menus,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar cardápio',
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
      const menu = await this.prisma.menu.findUnique({
        where: { id },
      });

      return menu;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar cardápio',
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

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    try {
      const updated = await this.prisma.menu.update({
        data: {
          shift: updateMenuDto.shift,
        },
        where: { id },
      });

      return updated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao buscar cardápio',
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
      const menuAlreadyExists = await this.prisma.menu.findUnique({
        where: { id },
      });

      if (!menuAlreadyExists) {
        throw new HttpException(
          {
            message: 'Esta cardápio não existe',
          },
          404,
        );
      }

      await this.prisma.menu.delete({ where: { id } });

      return {
        message: ' deletado com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao deletar cardápio',
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

  async actual() {
    const now = new Date();
    const actualHour = now.getHours();
    const shift = actualHour >= 18 || actualHour < 6 ? 'NOTURNO' : 'DIURNO';

    try {
      const menu = await this.prisma.menu.findUnique({
        where: {
          shift,
        },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              urlImage: true,
              description: true,
            },
          },
        },
      });

      if (!menu) {
        throw new HttpException(
          {
            message: 'Sem cardápio no momento',
          },
          404,
        );
      }

      return menu;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          {
            message: 'Erro ao deletar cardápio',
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
