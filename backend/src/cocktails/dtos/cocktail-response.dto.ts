import { ApiProperty } from '@nestjs/swagger';
import { Cocktails } from '../cocktails.entity';

export class CocktailResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Mojito' })
  title: string;

  @ApiProperty({ example: 'A refreshing cocktail with mint and lime.' })
  description: string;

  @ApiProperty({ example: 10 })
  price: number;

  static fromEntity(entity: Cocktails): CocktailResponseDto {
    const dto = new CocktailResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.price = entity.price;
    return dto;
  }
}
