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
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: ['title^2', 'description'],
                fuzziness: 'AUTO',
              },
            },
            {
              match_phrase_prefix: {
                title: {
                  query,
                  boost: 3,
                },
              },
            },
            {
              match_phrase_prefix: {
                description: {
                  query,
                },
              },
            },
          ],
        },
      },
    });
  
    return result.hits.hits.map((hit: any) => hit._source);
  }

  async deleteCocktail(id: number) {
    await this.esService.delete(
      {
        index: 'cocktails',
        id: String(id),
      },
      { ignore: [404] },
    );
  }
}
