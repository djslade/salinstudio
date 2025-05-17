import { IsNotEmpty } from 'class-validator';

export class CreateArtRequestDto {
  @IsNotEmpty()
  titleEn: string;

  @IsNotEmpty()
  titleFi: string;

  @IsNotEmpty()
  descriptionEn: string;

  @IsNotEmpty()
  descriptionFi: string;

  @IsNotEmpty()
  genreNameEn: string;
}
