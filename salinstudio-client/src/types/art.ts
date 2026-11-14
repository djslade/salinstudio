import type { Collection } from "./collection";
import type { Image } from "./image";

export type Art = {
  id: string;
  category: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  slug: string;
  // Lead image (same as images[0]).
  image: Image;
  // All images in order; only included when fetching a single artwork.
  images?: Image[];
  collections?: Collection[];
};
