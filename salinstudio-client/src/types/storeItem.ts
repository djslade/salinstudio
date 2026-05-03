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
  year: number;
  techniqueEn: string;
  techniqueFi: string;
  maxPrice: number;
  currentPrice: number;
  nanoId: string;
  art: Art;
  images: Image[];
};
