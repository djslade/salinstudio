import type { Image } from "./image";

export type Art = {
  id: string;
  category: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  slug: string;
  image: Image;
};
