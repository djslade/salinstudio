export type AboutContent = {
  paragraphs: { en: string; fi: string }[];
};

export type CvContent = {
  categories: {
    titleEn: string;
    titleFi: string;
    entries: { year: number; textEn: string; textFi: string }[];
  }[];
};
