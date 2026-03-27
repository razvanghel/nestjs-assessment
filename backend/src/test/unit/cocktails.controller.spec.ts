import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsController } from 'src/cocktails/cocktails.controller';
import { Cocktails } from 'src/cocktails/cocktails.entity';
import { CocktailsService } from 'src/cocktails/cocktails.service';
import { CocktailResponseDto } from 'src/cocktails/dtos/cocktail-response.dto';

const mockCocktail: Cocktails = {
  id: 1,
  title: 'Mojito',
  description: 'A refreshing cocktail',
  price: 10,
};

const mockResponse = CocktailResponseDto.fromEntity(mockCocktail);

const mockService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
});

describe('CocktailsController', () => {
  let controller: CocktailsController;
  let service: jest.Mocked<CocktailsService>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [CocktailsController],
      providers: [{ provide: CocktailsService, useFactory: mockService }],
    }).compile();

    controller = testingModule.get<CocktailsController>(CocktailsController);
    service = testingModule.get(CocktailsService);
  });

  describe('getAllCocktails', () => {
    it('should return all cocktails as response DTOs', async () => {
      service.findAll.mockResolvedValue([mockCocktail]);
      const result = await controller.searchCocktails();
      expect(result).toEqual([mockResponse]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no cocktails exist', async () => {
      service.findAll.mockResolvedValue([]);
      const result = await controller.searchCocktails();
      expect(result).toEqual([]);
    });
  });

  describe('getCocktailById', () => {
    it('should return a cocktail response DTO by id', async () => {
      service.findOne.mockResolvedValue(mockCocktail);
      const result = await controller.getCocktailById('1');
      expect(result).toEqual(mockResponse);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should pass the id as a number to the service', async () => {
      service.findOne.mockResolvedValue(mockCocktail);
      await controller.getCocktailById('42');
      expect(service.findOne).toHaveBeenCalledWith(42);
    });
  });

  describe('newCocktail', () => {
    const dto = { title: 'Mojito', description: 'A refreshing cocktail', price: 9.99 };

    it('should create a cocktail and return response DTO', async () => {
      service.create.mockResolvedValue(mockCocktail);
      const result = await controller.newCocktail(dto);
      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateCocktail', () => {
    const dto = { title: 'Updated Mojito', description: 'Updated description', price: 12 };

    it('should update and return response DTO', async () => {
      const updated = { ...mockCocktail, ...dto };
      service.update.mockResolvedValue(updated);
      const result = await controller.updateCocktail(1, dto);
      expect(result).toEqual(CocktailResponseDto.fromEntity(updated));
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteCocktail', () => {
    it('should delete a cocktail and return a success message', async () => {
      service.remove.mockResolvedValue({ message: 'Cocktail deleted successfully' });
      const result = await controller.deleteCocktail('1');
      expect(result).toEqual({ message: 'Cocktail deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should call service.search with query and return response DTOs', async () => {
      service.search.mockResolvedValue([mockCocktail]);
      const result = await controller.search('mojito');
      expect(result).toEqual([mockResponse]);
      expect(service.search).toHaveBeenCalledWith('mojito');
    });

    it('should handle empty query', async () => {
      service.search.mockResolvedValue([]);
      const result = await controller.search('');
      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith('');
    });
  });
});