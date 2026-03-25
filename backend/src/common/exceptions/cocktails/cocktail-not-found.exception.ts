import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app-exception';

export class CocktailNotFoundException extends AppException {
  constructor(id: number) {
    super(
      `Cocktail with id ${id} was not found`,
      HttpStatus.NOT_FOUND,
      'COCKTAIL_NOT_FOUND',
    );
  }
}