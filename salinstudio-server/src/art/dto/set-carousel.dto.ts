import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

// The full, ordered list of artworks on the home carousel. Artworks not listed
// are taken off the carousel. An empty list clears it.
export class SetCarouselDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  ids: string[];
}
