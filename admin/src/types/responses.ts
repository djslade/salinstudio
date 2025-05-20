export type LoginRequestBody = {
  username: string;
  password: string;
};

export type SignupRequestBody = LoginRequestBody & {
  secret: string;
};

export type CreateCategoryRequestBody = {
  nameEn: string;
  nameFi: string;
};

export type JsonRequestBody = {
  username?: string;
  password?: string;
  secret?: string;
  titleFi?: string;
  titleEn?: string;
  descriptionFi?: string;
  descriptionEn?: string;
};
