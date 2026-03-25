import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { CreateCocktailDto } from './dtos/create-cocktail.dto';
import { CocktailNotFoundException } from 'src/common/exceptions/cocktails/cocktail-not-found.exception';
import { CocktailTitleAlreadyExistsException } from 'src/common/exceptions/cocktails/cocktail-name-already-exists.exception';
import { UpdateCocktailDto } from './dtos/update-cocktail.dto';

@Injectable()
export class CocktailsService {
  private readonly logger = new Logger(CocktailsService.name);

  constructor(
    @InjectRepository(Cocktails)
    private usersRepository: Repository<Cocktails>,
  ) {}

  findAll(): Promise<Cocktails[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Cocktails | null> {
    const cocktail = await this.usersRepository.findOneBy({ id });

    if (!cocktail) {
      throw new CocktailNotFoundException(id);
    }

    return cocktail;
  }

  async create(dto: CreateCocktailDto): Promise<Cocktails> {
    const existing = await this.usersRepository.findOne({
      where: { title: dto.title },
    });

    if (existing) {
      throw new CocktailTitleAlreadyExistsException(dto.title);
    }

    const cocktail = this.usersRepository.create(dto);
    return this.usersRepository.save(cocktail);
  }

  async update(id: number, payload: UpdateCocktailDto) {
    const existing = await this.usersRepository.findOneBy({ id });
  
    if (!existing) {
      throw new CocktailNotFoundException(id);
    }
  
    if (payload.title) {
      const duplicate = await this.usersRepository.findOneBy({
        title: payload.title,
      });
  
      if (duplicate && duplicate.id !== id) {
        throw new CocktailTitleAlreadyExistsException(payload.title);
      }
    }
  
    const updated = this.usersRepository.merge(existing, payload);
  
    return this.usersRepository.save(updated);
  }
}
