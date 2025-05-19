import { IsArray } from 'class-validator';

export class OrderAllDto {
  @IsArray()
  ids: string[];
}
