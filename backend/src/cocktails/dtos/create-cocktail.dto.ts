import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateCocktailDto {
  @IsString()
  @Length(2, 100)
  title: string;

  @IsString()
  @Length(5, 500)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;
}