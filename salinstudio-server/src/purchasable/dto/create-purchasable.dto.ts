import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class createPurchasableDto {
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

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  isOriginal: boolean;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  isFramed: boolean;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  isFeatured: boolean;
}
