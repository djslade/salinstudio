import { IsBoolean, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class createPurchasableDto {
  @IsNotEmpty()
  artId: string;

  @IsDefined()
  techniqueEn: string;

  @IsDefined()
  techniqueFi: string;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  maxPrice: number;

  @IsNotEmpty()
  @IsNumber()
  currentPrice: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isOriginal: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isFramed: boolean;
}
