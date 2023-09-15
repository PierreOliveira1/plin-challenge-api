import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuSwaggerDto {
  @ApiProperty({
    enum: ['NOTURNO', 'DIURNO'],
  })
  shift: string;
}
