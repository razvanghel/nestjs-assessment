import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';

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

  findOne(id: number): Promise<Cocktails | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(cocktail: Cocktails): Promise<Cocktails> {
    return this.usersRepository.save(cocktail);
  }
}
