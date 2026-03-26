import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['title'])
export class Cocktails {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Mojito' })
  @Column()
  title: string;

  @ApiProperty({ example: 'A refreshing cocktail with mint and lime.' })
  @Column()
  description: string;

  @ApiProperty({ example: 9.99 })
  @Column()
  price: number;
}
