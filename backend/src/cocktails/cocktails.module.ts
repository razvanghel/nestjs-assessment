import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { Cocktails } from './cocktails.entity';
import { CocktailsSearchService } from './search/cocktails-search.service';
import { CocktailsSearchModule } from './search/cocktail-search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktails]), CocktailsSearchModule],
  providers: [CocktailsService],
  controllers: [CocktailsController],
})
export class CocktailsModule {}
