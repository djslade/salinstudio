import { IsDefined, IsNotEmpty } from 'class-validator';
import { ArtCategory } from '../entities/art.entity';

export class CreateArtDto {
  @IsNotEmpty()
  titleEn: string;

  @IsNotEmpty()
  titleFi: string;

  @IsDefined()
  descriptionEn: string;

  @IsDefined()
  descriptionFi: string;

  @IsNotEmpty()
  category: ArtCategory;
}
