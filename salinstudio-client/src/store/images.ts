import { defineStore } from "pinia";

export const useImageStore = defineStore("images", {
  state: () => {
    return { images: new Map<string, string>() };
  },
  actions: {
    get(key: string) {
      return this.images.get(key);
    },
    set(key: string, value: string) {
      this.images.set(key, value);
    },
  },
});
