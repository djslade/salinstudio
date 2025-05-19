import { IsArray, IsNotEmpty } from 'class-validator';
import { ArtCategory } from '../entities/art.entity';

export class OrderCategoryDto {
  @IsArray()
  ids: string[];

  @IsNotEmpty()
  category: ArtCategory;
}
