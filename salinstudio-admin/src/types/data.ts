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
  onHomeCarousel: boolean;
};

export type Category = {
  id: string;
  nameEn: string;
  nameFi: string;
};

export type Action = {
  visitor?: Visitor;
  id: string;
  type: string;
  path: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
};

export type Visitor = {
  id: string;
  continent: string;
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  isMobileUser: boolean;
  isUsingProxy: boolean;
  isTester: boolean;
  createdAt: string;
  updatedAt: string;
  actions: Action[];
};

export type GetAllVisitorsRes = {
  visitors: Visitor[];
};
