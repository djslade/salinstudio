import type { Art } from "./art";

export type LoadedImageMetadata = {
  art?: Art;
};

export type LoadedImage = {
  src: string;
  ratio: number;
  metadata?: LoadedImageMetadata;
};
