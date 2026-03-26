import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { CreateCocktailDto } from './dtos/create-cocktail.dto';
import { CocktailNotFoundException } from 'src/common/exceptions/cocktails/cocktail-not-found.exception';
import { CocktailTitleAlreadyExistsException } from 'src/common/exceptions/cocktails/cocktail-name-already-exists.exception';
import { UpdateCocktailDto } from './dtos/update-cocktail.dto';
import { CocktailIdInvalid } from 'src/common/exceptions/cocktails/cocktail-invalid-id.exception';
import { CocktailsSearchService } from './search/cocktails-search.service';

@Injectable()
export class CocktailsService {
  private readonly logger = new Logger(CocktailsService.name);

  constructor(
    @InjectRepository(Cocktails)
    private usersRepository: Repository<Cocktails>,
    private readonly searchService: CocktailsSearchService,
  ) {}

  findAll(): Promise<Cocktails[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Cocktails | null> {
    const cocktailId = Number(id);
    if (Number.isNaN(cocktailId)) {
      throw new CocktailIdInvalid();
    }
    const cocktail = await this.usersRepository.findOneBy({ id: cocktailId });

    if (!cocktail) {
      throw new CocktailNotFoundException(id);
    }

    return cocktail;
  }

  async create(dto: CreateCocktailDto): Promise<Cocktails> {
    const existing = await this.usersRepository.findOne({
      where: { title: ILike(dto.title) },
    });

    if (existing) {
      throw new CocktailTitleAlreadyExistsException(dto.title);
    }

    const cocktail = this.usersRepository.create(dto);
    const saved = await this.usersRepository.save(cocktail);
    try {
      await this.searchService.indexCocktail(saved);
    } catch (e) {
      //prevent ES failure from breaking the API
      this.logger.warn('Failed to sync ES index');
    }
    return saved;
  }

  async search(query: string) {
    const trimmedQuery = query?.trim();

    if (!trimmedQuery) {
      return this.findAll();
    }
    
    return await this.searchService.search(query);
   
  }

  async update(id: number, payload: UpdateCocktailDto) {
    const existing = await this.usersRepository.findOneBy({ id });

    if (!existing) {
      throw new CocktailNotFoundException(id);
    }

    if (payload.title) {
      const duplicate = await this.usersRepository.findOne({
        where: { title: ILike(payload.title) }, 
      });

      if (duplicate && duplicate.id !== id) {
        throw new CocktailTitleAlreadyExistsException(payload.title);
      }
    }

    const updated = this.usersRepository.merge(existing, payload);

    const saved = await this.usersRepository.save(updated);
    try {
      await this.searchService.indexCocktail(saved);
    } catch (e) {
      //prevent ES failure from breaking the API
      this.logger.warn('Failed to sync ES index');
    }
    return saved;
  }

  async remove(id: number): Promise<{ message: string }> {
    const cocktailId = Number(id);
    if (Number.isNaN(cocktailId)) {
      throw new CocktailIdInvalid();
    }
    const existing = await this.usersRepository.findOneBy({ id: cocktailId });

    if (!existing) {
      throw new CocktailNotFoundException(cocktailId);
    }

    await this.usersRepository.remove(existing);
    await this.searchService.deleteCocktail(cocktailId);
     
    return {
      message: 'Cocktail deleted successfully',
    };
  }
}
