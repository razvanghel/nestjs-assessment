import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import { Logger } from '@nestjs/common';

@Controller('cocktails')
export class CocktailsController {
  private readonly logger = new Logger(CocktailsController.name);
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  searchCocktails(): Promise<Cocktails[]> {
    return this.cocktailsService.findAll();
  }

  @Get(':id')
  getCocktailById(@Param('id') id: string): Promise<Cocktails | null> {
    return this.cocktailsService.findOne(Number(id));
  }

  @Post()
  async newCocktail(@Body() cocktail: Cocktails) {
    this.logger.log('info: creating cocktail', cocktail);
    const res = await this.cocktailsService.create(cocktail);
    this.logger.log(`Cocktail created with id: ${res.id}`);
    return true;
  }
}
