import { HttpStatus } from '@nestjs/common';
import { AppException } from '../app-exception';

export class CocktailIdInvalid extends AppException {
  constructor() {
    super('Invalid cocktail id', HttpStatus.BAD_REQUEST, 'INVALID_COCKTAIL_ID');
  }
}
