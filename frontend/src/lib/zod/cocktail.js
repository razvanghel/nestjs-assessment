import { z } from 'zod';

export const createCocktailSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(40, 'Title must be at most 40 characters'),

  price: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined;
      }

      const num = Number(val);

      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({ invalid_type_error: 'Price must be a number' })
      .min(1, 'Price must be at least 1')
      .max(10000, 'Price must be at most 10 000'),
  ),

  description: z
    .string()
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(300, 'Description must be at most 300 characters'),
});

export const updateCocktailSchema = createCocktailSchema;
