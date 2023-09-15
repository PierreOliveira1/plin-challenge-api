import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateMenuSchema = z.object({
  shift: z.enum(['NOTURNO', 'DIURNO']),
});

export class CreateMenuDto extends createZodDto(CreateMenuSchema) {}
