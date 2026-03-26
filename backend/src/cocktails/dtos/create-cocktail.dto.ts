import { IsString, IsNumber, Min, Length, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCocktailDto {
  @ApiProperty({ example: 'Mojito', minLength: 2, maxLength: 40 })
  @IsString()
  @Length(2, 40)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    example: 'A refreshing cocktail with mint and lime.',
    minLength: 5,
    maxLength: 300,
  })
  @IsString()
  @Length(5, 300)
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({ example: 12, minimum: 1, maximum: 10000 })
  @IsNumber()
  @Min(1)
  @Max(10000) 
  price: number;
}
