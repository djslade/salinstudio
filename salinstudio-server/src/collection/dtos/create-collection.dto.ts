import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  titleEn: string;

  @IsNotEmpty()
  titleFi: string;

  @IsDefined()
  descriptionEn: string;

  @IsDefined()
  descriptionFi: string;
}
