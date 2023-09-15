import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategorySwaggerDto {
  @ApiPropertyOptional()
  name: string;
}
