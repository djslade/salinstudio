export type Art = {
  id: string;
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  category: string;
  fingerprintChecksum: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  nameEn: string;
  nameFi: string;
};
