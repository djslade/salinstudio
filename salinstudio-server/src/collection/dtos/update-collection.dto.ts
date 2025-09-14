import { IsDefined, IsNotEmpty } from 'class-validator';

export class UpdateCollectionDto {
  @IsNotEmpty()
  titleEn: string;

  @IsNotEmpty()
  titleFi: string;

  @IsDefined()
  descriptionEn: string;

  @IsDefined()
  descriptionFi: string;
}
