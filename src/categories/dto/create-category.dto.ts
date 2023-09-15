import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateCategorySchema = z.object({
  name: z.string().min(1).max(255),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
