import type { LoadedImage, LoadedImageMetadata } from "../types/LoadedImage";

export const preloadImage = (
  src: string,
  metadata?: LoadedImageMetadata
): Promise<LoadedImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve({
        src,
        ratio: img.naturalWidth / img.naturalHeight,
        metadata,
      });
    };
    img.onerror = reject;
  });
};
