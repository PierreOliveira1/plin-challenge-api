import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSwaggerDto {
  @ApiProperty({ format: 'binary', type: 'string' })
  image: any;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  menuId: string;
}
