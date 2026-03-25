import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import { Logger } from '@nestjs/common';
import { CreateCocktailDto } from './dtos/create-cocktail.dto';
import { UpdateCocktailDto } from './dtos/update-cocktail.dto';

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
  async newCocktail(@Body() cocktailDto: CreateCocktailDto) {
    this.logger.log('info: creating cocktail', cocktailDto);
    const res = await this.cocktailsService.create(cocktailDto);
    this.logger.log(`Cocktail created with id: ${res.id}`);
    return true;
  }

  @Put(':id')
  async updateCocktail(
    @Param('id') id: number,
    @Body() dto: UpdateCocktailDto,
  ) {
    return this.cocktailsService.update(id, dto);
  }
}
