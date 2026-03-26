import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CocktailsService } from './cocktails.service';
import { Logger } from '@nestjs/common';
import { CreateCocktailDto } from './dtos/create-cocktail.dto';
import { UpdateCocktailDto } from './dtos/update-cocktail.dto';
import { CocktailResponseDto } from './dtos/cocktail-response.dto';

@ApiTags('Cocktails')
@Controller('cocktails')
export class CocktailsController {
  private readonly logger = new Logger(CocktailsController.name);
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiResponse({ status: 200, description: 'List of all cocktails', type: [CocktailResponseDto] })
  async searchCocktails(): Promise<CocktailResponseDto[]> {
    const cocktails = await this.cocktailsService.findAll();
    return cocktails.map(CocktailResponseDto.fromEntity);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cocktails by title or description' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query', example: 'mojito' })
  @ApiResponse({ status: 200, description: 'Search results', type: [CocktailResponseDto] })
  async search(@Query('q') query: string): Promise<CocktailResponseDto[]> {
    const cocktails = await this.cocktailsService.search(query);
    return cocktails.map(CocktailResponseDto.fromEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'The cocktail', type: CocktailResponseDto })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  async getCocktailById(@Param('id') id: string): Promise<CocktailResponseDto> {
    const cocktail = await this.cocktailsService.findOne(Number(id));
    return CocktailResponseDto.fromEntity(cocktail);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: 201, description: 'Cocktail created successfully', type: CocktailResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  async newCocktail(@Body() cocktailDto: CreateCocktailDto): Promise<CocktailResponseDto> {
    const res = await this.cocktailsService.create(cocktailDto);
    this.logger.log(`Cocktail created with id: ${res.id}`);
    return CocktailResponseDto.fromEntity(res);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cocktail' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Cocktail updated successfully', type: CocktailResponseDto })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  async updateCocktail(@Param('id') id: number, @Body() dto: UpdateCocktailDto): Promise<CocktailResponseDto> {
    const cocktail = await this.cocktailsService.update(id, dto);
    return CocktailResponseDto.fromEntity(cocktail);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cocktail' })
  @ApiParam({ name: 'id', description: 'Cocktail ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Cocktail deleted successfully', schema: { example: { message: 'Cocktail deleted successfully' } } })
  @ApiResponse({ status: 404, description: 'Cocktail not found' })
  async deleteCocktail(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Deleting cocktail with id: ${id}`);
    return this.cocktailsService.remove(Number(id));
  }
}