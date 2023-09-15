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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCategorySwaggerDto } from './docs/create-category.docs';
import { UpdateCategorySwaggerDto } from './docs/update-category.docs';
import { PaginationSwaggerDto } from 'src/docs/pagination.docs';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBody({
    type: CreateCategorySwaggerDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiQuery({
    type: PaginationSwaggerDto,
  })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.categoriesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateCategorySwaggerDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
