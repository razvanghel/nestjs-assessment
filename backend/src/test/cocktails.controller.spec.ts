import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsController } from 'src/cocktails/cocktails.controller';
import { Cocktails } from 'src/cocktails/cocktails.entity';
import { CocktailsService } from 'src/cocktails/cocktails.service';

const mockCocktail: Cocktails = {
  id: 1,
  title: 'Mojito',
  description: 'A refreshing cocktail',
  price: 9.99,
};

const mockService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('CocktailsController', () => {
  let controller: CocktailsController;
  let service: jest.Mocked<CocktailsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CocktailsController],
      providers: [{ provide: CocktailsService, useFactory: mockService }],
    }).compile();

    controller = module.get<CocktailsController>(CocktailsController);
    service = module.get(CocktailsService);
  });

  describe('getAllCocktails', () => {
    it('should return all cocktails', async () => {
      service.findAll.mockResolvedValue([mockCocktail]);
      const result = await controller.searchCocktails();
      expect(result).toEqual([mockCocktail]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no cocktails exist', async () => {
      service.findAll.mockResolvedValue([]);
      const result = await controller.searchCocktails();
      expect(result).toEqual([]);
    });
  });

  describe('getCocktailById', () => {
    it('should return a cocktail by id', async () => {
      service.findOne.mockResolvedValue(mockCocktail);
      const result = await controller.getCocktailById('1');
      expect(result).toEqual(mockCocktail);
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

    it('should create a cocktail and return true', async () => {
      service.create.mockResolvedValue(mockCocktail);
      const result = await controller.newCocktail(dto);
      expect(result).toBe(true);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateCocktail', () => {
    const dto = { title: 'Updated Mojito', description: 'Updated description', price: 12 };

    it('should update and return the cocktail', async () => {
      const updated = { ...mockCocktail, ...dto };
      service.update.mockResolvedValue(updated);
      const result = await controller.updateCocktail(1, dto);
      expect(result).toEqual(updated);
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
});
