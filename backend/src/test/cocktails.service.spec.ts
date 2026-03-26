import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CocktailNotFoundException } from 'src/common/exceptions/cocktails/cocktail-not-found.exception';
import { CocktailTitleAlreadyExistsException } from 'src/common/exceptions/cocktails/cocktail-name-already-exists.exception';
import { CocktailIdInvalid } from 'src/common/exceptions/cocktails/cocktail-invalid-id.exception';
import { CocktailsService } from 'src/cocktails/cocktails.service';
import { Cocktails } from 'src/cocktails/cocktails.entity';
import { CocktailsSearchService } from 'src/cocktails/search/cocktails-search.service';

const mockCocktail: Cocktails = {
  id: 1,
  title: 'Mojito',
  description: 'A refreshing cocktail',
  price: 9.99,
};

const mockRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

const mockSearchService = () => ({
  search: jest.fn(),
  indexCocktail: jest.fn(),
});

describe('CocktailsService', () => {
  let service: CocktailsService;
  let repo: jest.Mocked<Repository<Cocktails>>;
  let searchService: jest.Mocked<CocktailsSearchService>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        CocktailsService,
        { provide: getRepositoryToken(Cocktails), useFactory: mockRepository },
        { provide: CocktailsSearchService, useFactory: mockSearchService },
      ],
    }).compile();

    service = testingModule.get<CocktailsService>(CocktailsService);
    repo = testingModule.get(getRepositoryToken(Cocktails));
    searchService = testingModule.get(CocktailsSearchService);
  });

  describe('findAll', () => {
    it('should return all cocktails', async () => {
      repo.find.mockResolvedValue([mockCocktail]);
      const result = await service.findAll();
      expect(result).toEqual([mockCocktail]);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when there are no cocktails', async () => {
      repo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a cocktail by id', async () => {
      repo.findOneBy.mockResolvedValue(mockCocktail);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCocktail);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw CocktailNotFoundException when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(CocktailNotFoundException);
    });

    it('should throw CocktailIdInvalid when id is NaN', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow(CocktailIdInvalid);
      expect(repo.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const dto = { title: 'Mojito', description: 'A refreshing cocktail', price: 9.99 };

    it('should create and index cocktail', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockCocktail);
      repo.save.mockResolvedValue(mockCocktail);

      const result = await service.create(dto);

      expect(result).toEqual(mockCocktail);
      expect(searchService.indexCocktail).toHaveBeenCalledWith(mockCocktail);
    });

    it('should throw CocktailTitleAlreadyExistsException when title is taken', async () => {
      repo.findOne.mockResolvedValue(mockCocktail);
      await expect(service.create(dto)).rejects.toThrow(CocktailTitleAlreadyExistsException);
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const dto = { title: 'New Mojito', description: 'Updated description', price: 12 };

    it('should update and return the cocktail', async () => {
      const updated = { ...mockCocktail, ...dto };
      repo.findOneBy.mockResolvedValue(mockCocktail);
      repo.findOneBy.mockResolvedValueOnce(mockCocktail);
      repo.findOneBy.mockResolvedValueOnce(null);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result).toEqual(updated);
      expect(repo.save).toHaveBeenCalledWith(updated);
    });

    it('should throw CocktailNotFoundException when cocktail does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, dto)).rejects.toThrow(CocktailNotFoundException);
    });

    it('should throw CocktailTitleAlreadyExistsException when new title belongs to another cocktail', async () => {
      const anotherCocktail = { ...mockCocktail, id: 2 };
      repo.findOneBy.mockResolvedValueOnce(mockCocktail).mockResolvedValueOnce(anotherCocktail);

      await expect(service.update(1, dto)).rejects.toThrow(CocktailTitleAlreadyExistsException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should allow updating the title to the same value (same id)', async () => {
      const updated = { ...mockCocktail, ...dto };
      repo.findOneBy.mockResolvedValueOnce(mockCocktail).mockResolvedValueOnce(mockCocktail);
      repo.merge.mockReturnValue(updated);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a cocktail and return a success message', async () => {
      repo.findOneBy.mockResolvedValue(mockCocktail);
      repo.remove.mockResolvedValue(mockCocktail);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Cocktail deleted successfully' });
      expect(repo.remove).toHaveBeenCalledWith(mockCocktail);
    });

    it('should throw CocktailNotFoundException when cocktail does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(CocktailNotFoundException);
    });

    it('should throw CocktailIdInvalid when id is NaN', async () => {
      await expect(service.remove(NaN)).rejects.toThrow(CocktailIdInvalid);
    });
  });

  describe('search', () => {
    it('should return results from Elasticsearch when it succeeds', async () => {
      const results = [mockCocktail];
      searchService.search.mockResolvedValue(results);

      const result = await service.search('mojito');

      expect(result).toEqual(results);
      expect(searchService.search).toHaveBeenCalledWith('mojito');
    });

    it('should fallback to database search when Elasticsearch fails', async () => {
      searchService.search.mockRejectedValue(new Error('ES down'));
      repo.find.mockResolvedValue([mockCocktail]);

      const result = await service.search('mojito');

      expect(result).toEqual([mockCocktail]);
      expect(repo.find).toHaveBeenCalledWith({
        where: [{ title: expect.anything() }, { description: expect.anything() }],
      });
    });

    it('should return all cocktails when query is only whitespace', async () => {
      repo.find.mockResolvedValue([mockCocktail]);

      const result = await service.search('   ');

      expect(result).toEqual([mockCocktail]);
      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(searchService.search).not.toHaveBeenCalled();
    });

    it('should return all cocktails when query is empty', async () => {
      repo.find.mockResolvedValue([mockCocktail]);

      const result = await service.search('');

      expect(result).toEqual([mockCocktail]);
      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(searchService.search).not.toHaveBeenCalled();
    });

    it('should search in title and description in fallback', async () => {
      searchService.search.mockRejectedValue(new Error('ES down'));
      repo.find.mockResolvedValue([]);

      await service.search('mint');

      expect(repo.find).toHaveBeenCalledWith({
        where: [{ title: expect.anything() }, { description: expect.anything() }],
      });
    });
  });
});
