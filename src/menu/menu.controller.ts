import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMenuSwaggerDto } from './docs/create-menu.docs';
import { UpdateMenuSwaggerDto } from './docs/update-menu.docs';
import { PaginationSwaggerDto } from 'src/docs/pagination.docs';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBody({
    type: CreateMenuSwaggerDto,
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiQuery({
    type: PaginationSwaggerDto,
  })
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.menuService.findAll(Number(page), Number(limit));
  }

  @Get('actual')
  actual() {
    return this.menuService.actual();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateMenuSwaggerDto,
  })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
