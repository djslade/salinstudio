export const defaultTitle = "Artist and Visual Storyteller - Miia Salin";

export const defaultDescription =
  "Miia Salin is a Finnish visual artist and storyteller specializing in portraits, still life, and surrealist art.";

export const defaultDescriptionFi =
  "Miia Salin on suomalainen kuvataiteilija ja visuaalinen tarinankertoja.";

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
];

const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const deleteMetaByName = (name: string) => {
  const element = document.querySelector(`meta[name="${name}"]`);
  if (!element) return;
  element.remove();
};

const deleteMetaByProperty = (property: string) => {
  const element = document.querySelector(`meta[property="${property}"]`);
  if (!element) return;
  element.remove();
};

const updateCanonicalUrl = (url: string) => {
  let element = document.querySelector('link[rel="canonical"');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
};

export const setStaticMetadata = () => {
  updateMetaTag("keywords", keywords.join(", "));
  updateMetaProperty("og:type", "website");
};

export const setUrl = (url: string) => {
  updateCanonicalUrl(url);
  updateMetaProperty("og:url", url);
};

export const setTitle = (title: string) => {
  document.title = title;
  updateMetaProperty("og:title", title);
  updateMetaProperty("twitter:title", title);
};

export const setDescription = (description: string) => {
  updateMetaTag("description", description);
  updateMetaProperty("og:description", description);
  updateMetaProperty("twitter:description", description);
};

export const clearDescription = () => {
  deleteMetaByName("description");
  deleteMetaByProperty("og:description");
  deleteMetaByProperty("twitter:description");
};

export const setImages = (imageUrl: string) => {
  updateMetaProperty("og:image", imageUrl);
  updateMetaProperty("twitter:card", imageUrl);
  updateMetaProperty("twitter:image", imageUrl);
};

export const clearImages = () => {
  deleteMetaByProperty("og:image");
  deleteMetaByProperty("twitter:card");
  deleteMetaByProperty("twitter:image");
};

export const setNoIndex = () => {
  updateMetaTag("prerender-status-code", "404");
  updateMetaTag("robots", "noindex");
};

export const clearNoIndex = () => {
  deleteMetaByName("prerender-status-code");
  deleteMetaByName("robots");
};

export const setHtmlLang = (lang: string) => {
  const element = document.querySelector("html");
  if (!element) return;
  element.setAttribute("lang", lang);
};
