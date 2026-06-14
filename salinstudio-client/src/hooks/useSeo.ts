import { useHead, useSeoMeta } from "@unhead/vue";
import { useRoute } from "vue-router";

const BASE_URL = "https://miiasalin.com";

export const defaultTitle = "Artist and Visual Storyteller - Miia Salin";
export const defaultDescription =
  "Miia Salin is a Finnish visual artist and storyteller specializing in portraits, still life, and surrealist art.";
export const defaultDescriptionFi =
  "Miia Salin on suomalainen kuvataiteilija ja visuaalinen tarinankertoja.";
export const defaultImageUrl = "/desktop/1755546690870.jpg";

const keywords = [
  "abstract",
  "symbolism",
  "surrealism",
  "expressionism",
  "international",
  "finnish",
  "commissions",
  "communication",
  "inclusive",
  "animals",
  "portraits",
  "still life",
  "pets",
  "emotional",
  "storyteller",
  "symbolic",
  "sketch",
  "watercolor",
  "oil paintings",
  "digital art",
  "pastels",
  "colorful",
  "charcoal",
  "artist",
  "visual",
].join(", ");

type SeoInput = {
  title?: () => string | undefined | null;
  description?: () => string | undefined | null;
  imageUrl?: () => string | undefined | null;
  noindex?: boolean;
};

export const useSeo = (input?: SeoInput) => {
  const route = useRoute();

  const locale = () => route.params.locale as string | undefined;

  const title = () => {
    const custom = input?.title?.();
    if (custom) return custom;
    return locale() === "fi"
      ? ((route.meta.titleFi as string) ?? defaultTitle)
      : ((route.meta.title as string) ?? defaultTitle);
  };

  const description = () => {
    const custom = input?.description?.();
    if (custom) return custom;
    return locale() === "fi" ? defaultDescriptionFi : defaultDescription;
  };

  const absoluteImageUrl = () => {
    const img = input?.imageUrl?.() ?? defaultImageUrl;
    return img.startsWith("/") ? `${BASE_URL}${img}` : img;
  };

  const canonicalUrl = () => `${BASE_URL}${route.path}`;

  const pathWithoutLocale = () =>
    route.path.replace(/^\/(en|fi)/, "") || "/";

  useSeoMeta({
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    ogImage: absoluteImageUrl,
    twitterImage: absoluteImageUrl,
    twitterCard: "summary_large_image",
    ogType: "website",
    ogUrl: canonicalUrl,
    ogSiteName: "Miia Salin",
    keywords,
    robots: input?.noindex ? "noindex" : undefined,
  });

  useHead({
    htmlAttrs: { lang: () => (locale() === "fi" ? "fi" : "en") },
    link: [
      { rel: "canonical", href: canonicalUrl },
      {
        rel: "alternate",
        hreflang: "x-default",
        href: () => `${BASE_URL}${pathWithoutLocale()}`,
      },
      {
        rel: "alternate",
        hreflang: "en",
        href: () => `${BASE_URL}/en${pathWithoutLocale()}`,
      },
      {
        rel: "alternate",
        hreflang: "fi",
        href: () => `${BASE_URL}/fi${pathWithoutLocale()}`,
      },
    ],
  });
};
