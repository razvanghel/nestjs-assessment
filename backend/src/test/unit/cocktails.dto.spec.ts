import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCocktailDto } from 'src/cocktails/dtos/create-cocktail.dto';
import { UpdateCocktailDto } from 'src/cocktails/dtos/update-cocktail.dto';

// Helpers
const validateDto = async (cls: new () => object, plain: Record<string, unknown>) => {
  const instance = plainToInstance(cls, plain);
  return validate(instance);
};

const validPayload = {
  title: 'Mojito',
  description: 'A refreshing classic cocktail',
  price: 10,
};

describe('CreateCocktailDto', () => {
  it('should pass with valid data', async () => {
    const errors = await validateDto(CreateCocktailDto, validPayload);
    expect(errors).toHaveLength(0);
  });
  describe('title', () => {
    it('should fail when title is missing', async () => {
      const { title, ...rest } = validPayload;
      const errors = await validateDto(CreateCocktailDto, rest);
      expect(errors.some((e) => e.property === 'title')).toBe(true);
    });

    it('should fail when title is shorter than 2 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, title: 'A' });
      expect(errors.some((e) => e.property === 'title')).toBe(true);
    });

    it('should fail when title is longer than 40 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, {
        ...validPayload,
        title: 'A'.repeat(41),
      });
      expect(errors.some((e) => e.property === 'title')).toBe(true);
    });

    it('should pass with title of exactly 2 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, title: 'AB' });
      expect(errors).toHaveLength(0);
    });

    it('should pass with title of exactly 40 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, {
        ...validPayload,
        title: 'A'.repeat(40),
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('description', () => {
    it('should fail when description is missing', async () => {
      const { description, ...rest } = validPayload;
      const errors = await validateDto(CreateCocktailDto, rest);
      expect(errors.some((e) => e.property === 'description')).toBe(true);
    });

    it('should fail when description is shorter than 5 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, description: 'Hi' });
      expect(errors.some((e) => e.property === 'description')).toBe(true);
    });

    it('should fail when description is longer than 300 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, {
        ...validPayload,
        description: 'A'.repeat(301),
      });
      expect(errors.some((e) => e.property === 'description')).toBe(true);
    });

    it('should pass with description of exactly 5 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, {
        ...validPayload,
        description: 'Hello',
      });
      expect(errors).toHaveLength(0);
    });

    it('should pass with description of exactly 200 characters', async () => {
      const errors = await validateDto(CreateCocktailDto, {
        ...validPayload,
        description: 'A'.repeat(200),
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('price', () => {
    it('should fail when price is missing', async () => {
      const { price, ...rest } = validPayload;
      const errors = await validateDto(CreateCocktailDto, rest);
      expect(errors.some((e) => e.property === 'price')).toBe(true);
    });

    it('should fail when price is 0', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, price: 0 });
      expect(errors.some((e) => e.property === 'price')).toBe(true);
    });

    it('should fail when price is negative', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, price: -5 });
      expect(errors.some((e) => e.property === 'price')).toBe(true);
    });

    it('should fail when price is not a number', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, price: 'free' });
      expect(errors.some((e) => e.property === 'price')).toBe(true);
    });

    it('should pass with price of 1', async () => {
      const errors = await validateDto(CreateCocktailDto, { ...validPayload, price: 1 });
      expect(errors).toHaveLength(0);
    });
  });
});

describe('UpdateCocktailDto', () => {
  it('should pass with an empty object (all fields optional)', async () => {
    const errors = await validateDto(UpdateCocktailDto, {});
    expect(errors).toHaveLength(0);
  });

  it('should pass with only title provided', async () => {
    const errors = await validateDto(UpdateCocktailDto, { title: 'Mojito' });
    expect(errors).toHaveLength(0);
  });

  it('should pass with only price provided', async () => {
    const errors = await validateDto(UpdateCocktailDto, { price: 5.5 });
    expect(errors).toHaveLength(0);
  });

  it('should still enforce title min length when title is provided', async () => {
    const errors = await validateDto(UpdateCocktailDto, { title: 'A' });
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should still enforce price min when price is provided', async () => {
    const errors = await validateDto(UpdateCocktailDto, { price: 0 });
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should still enforce description min length when description is provided', async () => {
    const errors = await validateDto(UpdateCocktailDto, { description: 'Hi' });
    expect(errors.some((e) => e.property === 'description')).toBe(true);
  });
});
