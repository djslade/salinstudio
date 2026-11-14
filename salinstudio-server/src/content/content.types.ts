export type AboutParagraph = { en: string; fi: string };

export type AboutContent = {
  paragraphs: AboutParagraph[];
};

export type CvEntry = { year: number; textEn: string; textFi: string };

export type CvCategory = {
  titleEn: string;
  titleFi: string;
  entries: CvEntry[];
};

export type CvContent = {
  categories: CvCategory[];
};
