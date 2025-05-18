import { IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  nameEn: string;

  @IsNotEmpty()
  nameFi: string;
}
