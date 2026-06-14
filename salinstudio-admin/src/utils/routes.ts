import type { Art } from "../types/data";

export const resolvePageName = (path: string, artBySlug?: Map<string, string>): string => {
  const p = path.replace(/^\/(en|fi)(\/|$)/, "/");
  if (p === "/") return "Home";
  if (p === "/about") return "About";
  if (p === "/gallery") return "Gallery";
  if (p.startsWith("/gallery/")) {
    const slug = p.slice("/gallery/".length);
    return artBySlug?.get(slug) ?? "Art detail";
  }
  if (p === "/commissions") return "Commissions";
  if (p === "/contact") return "Contact";
  if (p === "/store") return "Store";
  if (p.startsWith("/checkout/complete/")) return "Purchase complete";
  if (p.startsWith("/checkout/")) return "Checkout";
  if (p.startsWith("/store/")) return "Store item";
  if (p === "/cart") return "Cart";
  return path;
};

export const buildArtSlugMap = (art: Art[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const piece of art) {
    map.set(piece.slug, piece.titleEn);
  }
  return map;
};
