import type { Image } from "./image";

export type Collection = {
  id: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  image: Image;
};
