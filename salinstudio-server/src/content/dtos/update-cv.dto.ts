import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CvEntryDto {
  @IsInt()
  @Min(1900)
  @Max(2200)
  year: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  textEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  textFi: string;
}

export class CvCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titleFi: string;

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CvEntryDto)
  entries: CvEntryDto[];
}

export class UpdateCvDto {
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CvCategoryDto)
  categories: CvCategoryDto[];
}
