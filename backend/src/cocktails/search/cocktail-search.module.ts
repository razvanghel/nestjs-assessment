import { Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CocktailsSearchService } from './cocktails-search.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [CocktailsSearchService],
  exports: [CocktailsSearchService],
})
export class CocktailsSearchModule implements OnModuleInit {
  constructor(private readonly searchService: CocktailsSearchService) {}

  async onModuleInit() {
    await this.searchService.createIndex();
  }
}