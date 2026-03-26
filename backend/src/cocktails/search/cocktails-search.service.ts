import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Mapping, Settings } from './mapping';
import { Cocktails } from '../cocktails.entity';

@Injectable()
export class CocktailsSearchService {
  private readonly index = 'cocktails';

  constructor(private readonly esService: ElasticsearchService) {}

  async createIndex() {
    const exists = await this.esService.indices.exists({
      index: this.index,
    });

    if (!exists) {
      await this.esService.indices.create({
        index: this.index,
        body: {
          mappings: Mapping,
          settings: Settings,
        },
      } as any);
    }
  }

  async indexCocktail(cocktail: Cocktails) {
    return this.esService.index({
      index: this.index,
      id: cocktail.id.toString(),
      document: {
        id: cocktail.id,
        title: cocktail.title,
        description: cocktail.description,
        price: cocktail.price,
      },
    });
  }

  async search(query: string) {
    const result = await this.esService.search({
      index: this.index,
      query: {
        multi_match: {
          query,
          type: 'cross_fields',
          fields: ['title^2', 'title.word_delimiter', 'description', 'description.word_delimiter'],
          fuzziness: 'AUTO',
          prefix_length: 1,
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }
}
