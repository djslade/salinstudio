import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class AboutParagraphDto {
  @IsString()
  @MaxLength(3000)
  en: string;

  @IsString()
  @MaxLength(3000)
  fi: string;
}

export class UpdateAboutDto {
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AboutParagraphDto)
  paragraphs: AboutParagraphDto[];
}
