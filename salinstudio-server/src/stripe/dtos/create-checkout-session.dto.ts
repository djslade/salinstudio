import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsNotEmpty()
  @IsString()
  nanoId: string;

  @IsOptional()
  @IsString()
  locale?: string;
}
