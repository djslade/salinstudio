import { IsNotEmpty } from 'class-validator';
import { ArtCategory } from '../entities/art.entity';

export class UpdateArtDto {
  @IsNotEmpty()
  titleEn: string;

  @IsNotEmpty()
  titleFi: string;

  @IsNotEmpty()
  descriptionEn: string;

  @IsNotEmpty()
  descriptionFi: string;

  @IsNotEmpty()
  category: ArtCategory;
}
