import { z } from 'zod';

export const createCocktailSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters'),

    price: z
    .preprocess((val) => (val === '' || val === null ? undefined : Number(val)),
      z.number({ invalid_type_error: 'Price must be a number' })
        .min(1, 'Price must be bigger than 0')
    ),

  description: z
    .string()
    .min(5, 'Description must be at least 5 characters'),
});