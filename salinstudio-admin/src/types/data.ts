export type Role = "admin" | "dev";

export type User = {
  id: string;
  username: string;
  role: Role;
};

export type Image = {
  id: string;
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
  aspectRatio: number;
};

export type Art = {
  id: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  category: string;
  fingerprintChecksum: number;
  createdAt: string;
  updatedAt: string;
  onHomeCarousel: boolean;
  image: Image;
  collections?: Collection[];
};

export type Collection = {
  id: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  createdAt: string;
  updatedAt: string;
  image: Image;
  art?: Art[];
};

export type Purchasable = {
  id: string;
  height: number;
  width: number;
  quantity: number;
  maxPrice: number;
  currentPrice: number;
  year: number;
  titleEn: string;
  titleFi: string;
  infoEn: string;
  infoFi: string;
  techniqueEn: string;
  techniqueFi: string;
  isOriginal: boolean;
  isFramed: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  createdAt: string;
  updatedAt: string;
  art: Art;
  images: Image[];
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
