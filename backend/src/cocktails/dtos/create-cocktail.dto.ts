import { IsString, IsNumber, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCocktailDto {
  @ApiProperty({ example: 'Mojito', minLength: 2, maxLength: 80 })
  @IsString()
  @Length(2, 80)
  title: string;

  @ApiProperty({
    example: 'A refreshing cocktail with mint and lime.',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  description: string;

  @ApiProperty({ example: 9.99, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  price: number;
}
