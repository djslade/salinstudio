import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class updatePurchasableDto {
  @IsNotEmpty()
  artId: string;

  @IsDefined()
  titleEn: string;

  @IsDefined()
  titleFi: string;

  @IsDefined()
  infoEn: string;

  @IsDefined()
  infoFi: string;

  @IsDefined()
  techniqueEn: string;

  @IsDefined()
  techniqueFi: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  maxPrice: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  currentPrice: number;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isPublic: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isOriginal: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isFramed: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isFeatured: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isOnSale: boolean;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @IsDefined()
  @IsArray()
  imageIds: string[];
}
