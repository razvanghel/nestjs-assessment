import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateCocktailDto {
  @IsString()
  @Length(2, 80)
  title: string;

  @IsString()
  @Length(5, 200)
  description: string;

  @IsNumber()
  @Min(0.01)
  price: number;
}
