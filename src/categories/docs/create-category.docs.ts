import { ApiProperty } from '@nestjs/swagger';

export class CreateCategorySwaggerDto {
  @ApiProperty()
  name: string;
}
