import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

function validateAndParsePrice(value: string): number {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    throw new Error('Price must be a valid number.');
  }
  if (numericValue < 0.01 || numericValue > 100000) {
    throw new Error('Price must be between 0.01 and 100000.');
  }
  return numericValue;
}

const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z
    .string()
    .refine((value) => {
      try {
        validateAndParsePrice(value);
        return true;
      } catch {
        return false;
      }
    })
    .transform(Number),
  description: z.string().max(1000),
  categoryId: z.string().uuid(),
  menuId: z.string().uuid(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
