import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductSwaggerDto {
  @ApiPropertyOptional({ format: 'binary', type: 'string' })
  image: any;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  price: number;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  categoryId: string;

  @ApiPropertyOptional()
  menuId: string;
}
