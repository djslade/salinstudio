import { IsArray } from 'class-validator';

export class OrderCarouselDto {
  @IsArray()
  ids: string[];
}
