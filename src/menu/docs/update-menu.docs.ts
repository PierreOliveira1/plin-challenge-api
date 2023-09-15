import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMenuSwaggerDto {
  @ApiPropertyOptional({
    enum: ['NOTURNO', 'DIURNO'],
  })
  shift: string;
}
