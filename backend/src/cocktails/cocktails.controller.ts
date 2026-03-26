import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import { Logger } from '@nestjs/common';
import { CreateCocktailDto } from './dtos/create-cocktail.dto';
import { UpdateCocktailDto } from './dtos/update-cocktail.dto';

@ApiTags('Cocktails')
@Controller('cocktails')
export class CocktailsController {
  private readonly logger = new Logger(CocktailsController.name);
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiResponse({ status: 200, description: 'List of all cocktails', type: [Cocktails] })
  searchCocktails(): Promise<Cocktails[]> {
    return this.cocktailsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cocktails by title or description' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query', example: 'mojito' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Cocktails] })
  search(@Query('q') query: string) {
    return this.cocktailsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'The cocktail', type: Cocktails })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  getCocktailById(@Param('id') id: string): Promise<Cocktails | null> {
    return this.cocktailsService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: 201, description: 'Cocktail created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  async newCocktail(@Body() cocktailDto: CreateCocktailDto) {
    this.logger.log('info: creating cocktail', cocktailDto);
    const res = await this.cocktailsService.create(cocktailDto);
    this.logger.log(`Cocktail created with id: ${res.id}`);
    return true;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cocktail' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Cocktail updated successfully', type: Cocktails })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  async updateCocktail(@Param('id') id: number, @Body() dto: UpdateCocktailDto) {
    return this.cocktailsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cocktail' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Cocktail deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  async deleteCocktail(@Param('id') id: string) {
    this.logger.log(`Deleting cocktail with id: ${id}`);
    return this.cocktailsService.remove(Number(id));
  }
}
