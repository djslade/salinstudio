import type { Art, Image } from "../types/data";

// Must match ART_MAX_IMAGES on the server.
export const ART_MAX_IMAGES = 5;

// All images of an artwork in display order (first = lead image).
export const getArtImages = (art: Art): Image[] => {
  if (art.images && art.images.length > 0) {
    return [...art.images].sort(
      (a, b) => (a.galleryIndex ?? 0) - (b.galleryIndex ?? 0),
    );
  }
  return art.image ? [art.image] : [];
};
