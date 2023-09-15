import { HttpException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'nestjs-zod/z';

export const ZodValidation = createZodValidationPipe({
  createValidationException: (errors: ZodError) => {
    const issues = errors.issues.map((issue) => {
      return {
        path: issue.path.join('.'),
        message: issue.message,
      };
    });

    return new HttpException(
      {
        issues,
      },
      400,
    );
  },
});
