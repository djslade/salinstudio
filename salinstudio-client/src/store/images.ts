import { defineStore } from "pinia";
import type { LoadedImage, LoadedImageMetadata } from "../types/LoadedImage";

export const useImageStore = defineStore("images", {
  state: () => {
    return { images: new Map<string, LoadedImage>() };
  },
  actions: {
    get(key: string) {
      return this.images.get(key);
    },
    set(key: string, value: LoadedImage) {
      this.images.set(key, value);
    },
    getRatio(key: string) {
      const image = this.images.get(key);
      if (!image) return 0;
      return image.ratio;
    },
    async preload(
      src: string,
      metadata?: LoadedImageMetadata
    ): Promise<LoadedImage> {
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
    },
    async preloadAndSet(src: string, metadata?: LoadedImageMetadata) {
      if (this.images.get(src)) return;
      const img = await this.preload(src, metadata);
      this.set(src, img);
    },
  },
});
