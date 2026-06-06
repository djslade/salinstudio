import type { Art } from "./art";
import type { Image } from "./image";

export type StoreItem = {
  id: string;
  height: number;
  width: number;
  quantity: number;
  isPublic: boolean;
  isOriginal: boolean;
  isFramed: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  year: number;
  titleEn: string;
  titleFi: string;
  infoEn: string;
  infoFi: string;
  techniqueEn: string;
  techniqueFi: string;
  maxPrice: number;
  currentPrice: number;
  nanoId: string;
  art: Art;
  images: Image[];
};
