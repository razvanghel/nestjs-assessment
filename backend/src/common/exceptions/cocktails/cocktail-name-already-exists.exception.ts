import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app-exception';

export class CocktailTitleAlreadyExistsException extends AppException {
  constructor(title: string) {
    super(
      `Cocktail with title "${title}" already exists`,
      HttpStatus.CONFLICT,
      'COCKTAIL_TITLE_ALREADY_EXISTS',
    );
  }
}