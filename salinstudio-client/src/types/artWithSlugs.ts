import type { Art } from "./art";

export type ArtWithSlugs = {
  art: Art;
  prevSlug: string;
  nextSlug: string;
};
